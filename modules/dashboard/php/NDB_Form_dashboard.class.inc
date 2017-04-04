<?php
/**
 * Dashboard: displays recruitment and study progression charts,
 * user tasks and document repository notifications
 *
 * PHP Version 5
 *
 * @category Main
 * @package  Loris
 * @author   Tara Campbell <tara.campbell@mail.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris
 */

/**
 * Dashboard: displays recruitment and study progression charts,
 * user tasks and document repository notifications
 *
 * @category Main
 * @package  Loris
 * @author   Tara Campbell <tara.campbell@mail.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris
 */

class NDB_Form_Dashboard extends NDB_Form
{

    /**
     * Creates the template data for the dashboard
     *
     * @return void As a side-effect merges required data into $this->tpl_data
     */
    function dashboard()
    {
        $DB     = Database::singleton();
        $user   = User::singleton();
        $config = NDB_Config::singleton();
        $last_login = $user->getLastLoginTimestamp();
        $useProjects = $config->getSetting('useProjects');

        $this->tpl_data = array_merge(
            $this->tpl_data,
            array(
                'username'            => $user->getFullname(),
                'user_site'           => $user->getCenterID(),
                'last_login'          => $last_login ?: "...never. Welcome!",
                'project_description' => $config->getSetting('projectDescription'),
                'useProjects'         => $useProjects,
                'dashboard_links'     => $this->_dashboardExternalLinks($config),
                'recruitment'         => $this->_dashboardRecruitment($config),
                'total_scans'         => $this->_dashboardTotalScans($DB),
            ),
            $this->_dashboardNewScans($user, $DB),
            $this->_dashboardDataEntryConflicts($user, $DB),
            $this->_dashboardIncompleteForms($user, $DB),
            $this->_dashboardFinalRadiologicalReview($user, $DB),
            $this->_dashboardAccountsPendingApproval($user, $DB),
            $this->_dashboardViolatedScans($user, $DB),
            $this->_dashboardDocumentRepositoryItems($user, $DB, $last_login),
            $this->_dashboardAssignedIssues($user, $DB),
            $this->_dashboardBehaviouralFeedbackItems($user, $DB, $last_login)
        );
    }

    /**
     * @param NDB_Config $config Reference config object
     *
     * @return array Array of objects which describe external links
     */
    private function _dashboardExternalLinks($config) {
        $result = array();

        foreach ($config->getExternalLinks('dashboard') as $text => $url) {
            $result[] = array(
                'url'        => $url,
                'label'      => $text,
                'WindowName' => md5($url),
            );
        }

        return $result;
    }

    /**
     * @param NDB_Config $config Reference to config object
     *
     * @return array Array of objects which describe project recruitment
     */
    private function _dashboardRecruitment($config) {
        $useProjects = $config->getSetting('useProjects');

        $result = array();

        $recruitmentTarget = $config->getSetting('recruitmentTarget');
        $overallRecruitment = $this->createProjectProgressBar(
            'overall',
            "Overall Recruitment",
            $recruitmentTarget,
            $this->getTotalRecruitment()
        );

        $result = array_merge($result, $overallRecruitment);

        if ($useProjects == "true") {
            $projects = Utility::getProjectList();
            foreach ($projects as $projectID => $project) {
                $projectInfo = $config->getProjectSettings($projectID);
                $projectRecruitment = $this->createProjectProgressBar(
                    $projectID,
                    $projectInfo['Name'],
                    $projectInfo['recruitmentTarget'],
                    $this->getTotalRecruitmentByProject($projectID)
                );
                $result = array_merge($result, $projectRecruitment);
            }
        }
        return $result;
    }

    /**
     * @param Database $DB Reference to database object
     *
     * @return int Number of total scans
     */
    private function _dashboardTotalScans($DB) {
        return $DB->pselectOne(
            "SELECT COUNT(*) FROM files f
             LEFT JOIN session s ON (s.ID=f.SessionID)
             LEFT JOIN candidate c ON (s.CandID=c.CandID)
             WHERE s.Active='Y' AND c.Active='Y'
			 AND s.CenterID <> 1",
            array()
        );
    }

    /**
     * @param User $user Reference to user object
     * @param Database $DB Reference to database object
     *
     * @return object Data related to new scans
     */
    private function _dashboardNewScans($user, $DB) {
        $result = array();

        if ($user->hasPermission('imaging_browser_qc')) {
            $result['new_scans'] = $DB->pselectOne(
                "SELECT COUNT(DISTINCT s.ID)
                 FROM files f 
                 LEFT JOIN files_qcstatus fqc ON (fqc.FileID=f.FileID)
                 LEFT JOIN session s ON (s.ID=f.SessionID)
                 LEFT JOIN candidate c ON (s.CandID=c.CandID)
                 WHERE fqc.QCStatus IS NULL
                 AND s.Active='Y' AND c.Active='Y'
                 AND s.CenterID <> 1",
                array()
            );
            $result['new_scans_site'] = 'Sites: all';
        }

        return $result;
    }

    /**
     * @param User $user Reference to user object
     * @param Database $DB Reference to database object
     *
     * @return object Data related to data entry conflicts
     */
    private function _dashboardDataEntryConflicts($user, $DB) {
        $result = array();

        if ($user->hasPermission('conflict_resolver')) {
            if ($user->hasPermission('access_all_profiles')) {
                $result['conflicts'] = $DB->pselectOne(
                    "SELECT COUNT(*) FROM conflicts_unresolved cu
                     LEFT JOIN flag ON (cu.CommentId1=flag.CommentID)
                     LEFT JOIN session s ON (flag.SessionID=s.ID)
                     LEFT JOIN candidate c ON (s.CandID=c.CandID)
                     WHERE s.CenterID <> 1
                     AND s.Active='Y' AND c.Active='Y'
                    ",
                    array()
                );
                $result['conflicts_site'] = 'Sites: all';
            } else {
                $result['conflicts'] = $DB->pselectOne(
                    "SELECT COUNT(*) FROM conflicts_unresolved cu 
                     LEFT JOIN flag ON (cu.CommentId1=flag.CommentID) 
                     LEFT JOIN session s ON (flag.SessionID=s.ID)
		             LEFT JOIN candidate c ON (c.CandID=s.CandID)
                     LEFT JOIN psc ON (psc.CenterID=s.CenterID) 
                     WHERE FIND_IN_SET(psc.CenterID, :siteID) 
			            AND s.Active='Y' AND c.Active='Y'",
                    array('siteID' => implode(',', $user->getCenterID()))
                );
                $result['conflicts_site'] = 'Sites: All User Sites';
            }
        }

        return $result;
    }

    /**
     * @param User $user Reference to user object
     * @param Database $DB Reference to database object
     *
     * @return object Data related to incomplete forms
     */
    private function _dashboardIncompleteForms($user, $DB) {
        $result = array();

        if ($user->hasPermission('data_entry')) {
            if ($user->hasPermission('access_all_profiles')) {
                $result['incomplete_forms'] = $DB->pselectOne(
                    "SELECT COUNT(*) FROM flag
                     LEFT JOIN session s ON (s.ID=flag.SessionID)
                     LEFT JOIN candidate c ON (s.CandID=c.CandID)
                     WHERE flag.Data_entry='In Progress'
                     AND s.Active='Y' AND c.Active='Y' AND s.CenterID <> 1
                     ",
                    array()
                );
                $result['incomplete_forms_site'] = 'Sites: all';
            } else {
                $result['incomplete_forms'] = $DB->pselectOne(
                    "SELECT COUNT(*) FROM flag
                     LEFT JOIN session s ON (flag.SessionID=s.ID)
                     LEFT JOIN candidate c ON (s.CandID=c.CandID)
                     LEFT JOIN psc ON (psc.CenterID=s.CenterID)
                     WHERE Data_entry='In Progress'
                     AND FIND_IN_SET(psc.CenterID, :siteID)
			         AND s.Active='Y' AND c.Active='Y'
			         ",
                    array('siteID' => implode(',', $user->getCenterID()))
                );
                $result['incomplete_forms_site'] = explode(';', $user->getSiteName());
            }
        }

        return $result;
    }

    /**
     * @param User $user Reference to user object
     * @param Database $DB Reference to database object
     *
     * @return object Data related to radiological review
     */
    private function _dashboardFinalRadiologicalReview($user, $DB) {
        $result = array();

        if ($user->hasPermission('edit_final_radiological_review')
            && $user->hasPermission('view_final_radiological_review')
        ) {
            $result['radiology_review'] = $DB->pselectOne(
                "SELECT COUNT(*) FROM final_radiological_review f
                 LEFT JOIN flag fg ON (fg.CommentID=f.CommentID)
                 LEFT JOIN session s ON (s.ID=fg.SessionID)
                 LEFT JOIN candidate c ON (c.CandID=s.CandID)
                 WHERE Review_Done IS NULL
                 AND c.Active='Y' AND s.Active='Y'
                ",
                array()
            );
            $result['radiology_review_site'] = 'Sites: all';
        }

        return $result;
    }

    /**
     * @param User $user Reference to user object
     * @param Database $DB Reference to database object
     *
     * @return object Data related to pending users
     */
    private function _dashboardAccountsPendingApproval($user, $DB) {
        $result = array();

        if ($user->hasPermission('user_accounts_multisite')
            && $user->hasPermission('user_accounts')
        ) {
            $result['pending_users'] = $DB->pselectOne(
                "SELECT COUNT(*) FROM users 
                 LEFT JOIN user_psc_rel as upr ON (upr.UserID=users.ID)
		         WHERE users.Pending_approval='Y'
                 AND (upr.CenterID <> 1 OR upr.CenterID IS NULL)
                ",
                array()
            );
            $result['pending_users_site'] = 'Sites: all';
        } elseif ($user->hasPermission('user_accounts')) {
            $result['pending_users'] = $DB->pselectOne(
                "SELECT COUNT(*) FROM users 
                LEFT JOIN user_psc_rel as upr ON (upr.UserID=users.ID)
		        WHERE users.Pending_approval='Y' AND upr.CenterID IN (:CID)",
                array('CID' => implode(",", $user->getCenterID()))
            );

            $result['pending_users_site'] = 'Sites: ' . explode(';', $user->getSiteName());
        }

        return $result;
    }

    /**
     * @param User $user Reference to user object
     * @param Database $DB Reference to database object
     *
     * @return object Data related to violated scans
     */
    private function _dashboardViolatedScans($user, $DB) {
        $result = array();

        if ($user->hasPermission('violated_scans_view_allsites')) {
            $result['violated_scans'] = $DB->pselectOne(
                "SELECT COUNT(*) FROM mri_protocol_violated_scans
                 LEFT JOIN candidate c USING (CandID)
                 WHERE COALESCE(c.CenterID, 0) <> 1
                ",
                /* include null CenterIDs so we don't accidentally
                filter things out */
                array()
            );
            $result['violated_scans_site'] = 'Sites: all';
        }

        return $result;
    }

    /**
     * @param User $user Reference to user object
     * @param Database $DB Reference to database object
     * @param string $last_login Timestamp for user's last login
     *
     * @return object Data related to document repository items
     */
    private function _dashboardDocumentRepositoryItems($user, $DB, $last_login) {
        $result = array();

        if ($user->hasPermission('document_repository_view')
            || $user->hasPermission('document_repository_delete')
        ) {
            $document_repository = $DB->pselect(
                "SELECT File_name, Date_uploaded, Data_dir FROM document_repository 
                 ORDER BY Date_uploaded DESC LIMIT 4",
                array()
            );
            for ($i=0; $i < sizeof($document_repository); $i++) {
                if ($document_repository[$i]['Date_uploaded'] > $last_login) {
                    $document_repository[$i]['new'] = 1;
                } else {
                    $document_repository[$i]['new'] = 0;
                }
            }
            $result['document_repository_notifications']
                = $document_repository;
        }

        return $result;
    }

    /**
     * @param User $user Reference to user object
     * @param Database $DB Reference to database object
     *
     * @return object Data related to assigned issues
     */
    private function _dashboardAssignedIssues($user, $DB) {
        $result = array();

        if ($user->hasPermission('issue_tracker_developer')) {
            $issue_tracker = $DB->pselectOne(
                "SELECT COUNT(*) FROM issues
                 WHERE status !='closed'
                 AND assignee=:userID",
                array('userID' => $user->getData('UserID'))
            );
            $result['issues_assigned'] = $issue_tracker;

            // I suppose you could also base it on your query
            if ($user->hasPermission('access_all_profiles')) {
                $result['issues_assigned_site'] = 'Sites: all';
            } else {
                $result['issues_assigned_site'] = 'Sites: '.
                    $user->getSiteName();
            }
        }

        return $result;
    }

    /**
     * @param User $user Reference to user object
     * @param Database $DB Reference to database object
     * @param string $last_login Timestamp for user's last login
     *
     * @return object Data related to behavioural feedback items
     */
    private function _dashboardBehaviouralFeedbackItems($user, $DB, $last_login) {
        $result = array();

        if ($user->hasPermission('bvl_feedback')) {
            $bvl_feedback = $DB->pselect(
                "SELECT fbt.Name, fbe.Testdate, fbe.Comment, fbth.FieldName, 
                fbth.CommentID, fbth.SessionID, fbth.CandID, fbth.Feedback_level
                 FROM feedback_bvl_entry fbe 
                 JOIN feedback_bvl_thread fbth USING (FeedbackID) 
                 JOIN feedback_bvl_type fbt USING (Feedback_type)
                 WHERE fbth.Status='opened' AND fbth.Active='Y'
                 ORDER BY Testdate DESC LIMIT 4",
                array()
            );
            for ($i=0; $i < sizeof($bvl_feedback); $i++) {
                if ($bvl_feedback[$i]['Testdate'] > $last_login) {
                    $bvl_feedback[$i]['new'] = 1;
                } else {
                    $bvl_feedback[$i]['new'] = 0;
                }
                if ($bvl_feedback[$i]['Feedback_level'] == 'profile') {
                    $bvl_feedback[$i]['URL'] = '/' . $bvl_feedback[$i]['CandID'];
                } else if ($bvl_feedback[$i]['Feedback_level'] == 'instrument') {
                    $instrument = $DB->pselectOne(
                        "SELECT Test_name from flag WHERE CommentID=:cid",
                        array('cid' => $bvl_feedback[$i]['CommentID'])
                    );
                    if ($instrument !== null) {
                        $bvl_feedback[$i]['URL'] = '/' . $instrument . '/?candID='
                            . $bvl_feedback[$i]['CandID'] . '&sessionID='
                            . $bvl_feedback[$i]['SessionID'] . '&commentID='
                            . $bvl_feedback[$i]['CommentID'];
                    }
                }
            }
            $result['bvl_feedback_notifications'] = $bvl_feedback;
        }

        return $result;
    }

    /**
     * Gets the total count of candidates associated with a specific project
     *
     * @return int
     */
    function getTotalRecruitment()
    {
        $DB = Database::singleton();
        $totalRecruitment = $DB->pselectOne(
            "SELECT COUNT(*) FROM candidate c
             WHERE c.Active='Y' AND c.Entity_type='Human' AND c.CenterID <> 1",
            array()
        );
        return $totalRecruitment;
    }

    /**
     * Gets the total count of candidates associated with a specific project
     *
     * @param int $projectID Project ID
     *
     * @return int
     */
    function getTotalRecruitmentByProject($projectID)
    {
        $DB = Database::singleton();
        $totalRecruitment = $DB->pselectOne(
            "SELECT COUNT(*)
             FROM candidate c
             WHERE c.Active='Y' AND c.ProjectID=:PID AND c.Entity_type='Human'
             AND c.CenterID <> 1",
            array('PID' => $projectID)
        );
        return $totalRecruitment;
    }

    /**
     * Gets the total count of candidates associated with a list of projects
     *
     * @return int
     */
    function getTotalRecruitmentForProjects($projectIDs)
    {
        $DB = Database::singleton();
        $totalRecruitment = $DB->pselectOne(
            "SELECT COUNT(*)
             FROM candidate c
             WHERE c.Active='Y' AND c.ProjectID=:PIDs AND c.Entity_type='Human'
             AND c.CenterID <> 1",
            array('PIDs' => implode(",", $projectIDs))
        );
        return $totalRecruitment;
    }


    /**
     * Gets the total count of candidates of a specific gender
     *
     * @param string $gender gender (male or female)
     *
     * @return int
     */
    function getTotalGender($gender)
    {
        $DB    = Database::singleton();
        $total = $DB->pselectOne(
            "SELECT COUNT(c.CandID)
             FROM candidate c
             WHERE c.Gender=:Gender AND c.Active='Y' AND c.Entity_type='Human'
             AND c.CenterID <> 1",
            array('Gender' => $gender)
        );
        return $total;
    }

    /**
     * Gets the total count of candidates of a specific gender,
     * associated with a specific project
     *
     * @param string $gender    gender (male or female)
     * @param int    $projectID Project ID
     *
     * @return int
     */
    function getTotalGenderByProject($gender, $projectID)
    {
        $DB    = Database::singleton();
        $total = $DB->pselectOne(
            "SELECT COUNT(c.CandID)
             FROM candidate c
             WHERE c.Gender=:Gender AND c.Active='Y' AND c.ProjectID=:PID
             AND c.Entity_type='Human' AND c.CenterID <> 1",
            array(
             'Gender' => $gender,
             'PID'    => $projectID,
            )
        );
        return $total;
    }

    /**
     * Creates the template data for a progress bar
     *
     * @param mixed  $ID                ID for the progress bar
     * @param string $title             Title for the progress bar
     * @param int    $recruitmentTarget Target number of candidates
     * @param int    $totalRecruitment  Total number of candidates
     *
     * @return array
     */
    function createProjectProgressBar(
        $ID, $title, $recruitmentTarget, $totalRecruitment
    ) {
        $result = array();

        $result[$ID]['total_recruitment'] = $totalRecruitment;
        $result[$ID]['title'] = $title;

        if (!empty($recruitmentTarget)) {
            $result[$ID]['recruitment_target']
                = $recruitmentTarget;

            if ($ID == 'overall') {
                $totalFemales = $this->getTotalGender("Female");
            } else {
                $totalFemales = $this->getTotalGenderByProject("Female", $ID);
            }
            $result[$ID]['female_total']   = $totalFemales;
            $result[$ID]['female_percent']
                = round($totalFemales / $recruitmentTarget * 100);

            if ($ID == 'overall') {
                $totalMales = $this->getTotalGender("Male");
            } else {
                $totalMales = $this->getTotalGenderByProject("Male", $ID);
            }
            $result[$ID]['male_total']   = $totalMales;
            $result[$ID]['male_percent']
                = round($totalMales / $recruitmentTarget * 100);

            if ($totalRecruitment > $recruitmentTarget) {
                $result[$ID]['surpassed_recruitment']
                    = "true";

                $result[$ID]['female_full_percent']
                    = round($totalFemales / $totalRecruitment * 100);

                $result[$ID]['male_full_percent']
                    = round($totalMales / $totalRecruitment * 100);
            }
        }
        return $result;
    }

    /**
     * Include additional CSS files:
     *  1. dashboard.css
     *
     * @return array of css to be included
     */
    function getCSSDependencies()
    {
        $factory = NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getCSSDependencies();
        return array_merge(
            $deps,
            [$baseURL . "/dashboard/css/dashboard.css"]
        );
    }

    /**
     * Add dependency on D3 and C3 javascript libraries
     * for the pretty dashboards in the chart
     *
     * @return array of javascript files to be included
     */
    function getJSDependencies()
    {
        $factory = NDB_Factory::singleton();
        $config  = $factory->config();

        $www     = $config->getSetting('www');
        $baseurl = $www['url'];

        $baseDeps = parent::getJSDependencies();

        return array_merge(
            $baseDeps,
            array(
             $baseurl . '/js/d3.min.js',
             $baseurl . '/js/c3.min.js',
             $baseurl . '/dashboard/js/dashboard-helper.js',
            )
        );

    }
}
?>
