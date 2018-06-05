<?php
/**
 * This file contains the JSON Instrument class
 *
 * PHP Version 5
 *
 * @category Main
 * @package  Behavioural
 * @author   Unknown <example@example.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
namespace Loris\Behavioural;
//use \Exception;
/**
 * JSON Instrument class
 *
 * @category Main
 * @package  Behavioural
 * @author   Unknown <example@example.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
class NDB_BVL_Instrument_JSON extends \NDB_BVL_Instrument
{
    var $InstrumentType = 'JSON';


    /**
     * Sets up the variables required for a JSON instrument to load
     *
     * @param string $commentID The CommentID being loaded
     * @param string $page      The page being loaded
     *
     * @return none
     */
    function setup($commentID = null, $page = null)
    {
        $this->commentID = $commentID;
        $this->page      = $page;
        parent::setup($commentID, $page);
    }

    /**
     * Returns candidate-related context variables to be accessed during runtime
     * Allows access to: date of birth, age in months (calculated)
     *
     * @return array containing context variables
     */
    function _getContext($datetaken = null)
    {
        $timepoint = \TimePoint::singleton($this->getSessionID());
        $candID    = $timepoint->getCandID();
        $candidate = \Candidate::singleton($candID);
        $dob       = $candidate->getCandidateDoB();
        $dobDT     = new \DateTime($dob);
        if (empty($datetaken)) { $datetaken = "now";
        }
        $curDate  = new \DateTime($datetaken);
        $interval = date_diff($curDate, $dobDT, true);
        $ageM     = $this->calculateAgeMonths(
            array(
             'year' => $interval->format("%y"),
             'mon'  => $interval->format("%m"),
             'day'  => $interval->format("%d"),
            )
        );
        //$ageTEST = $this->getCandidateAge($curDate); //TODO replace the hacky age function with this
        $gender = $candidate->getCandidateGender();
        return array(
                "age_mths" => $ageM,
                "dob"      => $dob,
                "gender"   => $gender,
                "context"  => array(
                               "age_mths" => $ageM,
                               "dob"      => $dob,
                               "gender"   => $gender,
                              ),
               );
    }

    function _getLang()
    {
        $timepoint = \TimePoint::singleton($this->getSessionID());
        $candID    = $timepoint->getCandID();
        $candidate = \Candidate::singleton($candID);
        $lang      = $candidate->getData("DisplayParameters")['Language'];
        $lang      = $lang == 'French' ? 'fr-ca' : 'en-ca';
        return $lang;
    }

    function _isComplete()
    {
        $status  = new \NDB_BVL_InstrumentStatus;
        $success = $status->select($this->commentID);
        return $status->getDataEntryStatus()==='Complete' ? true : false;
    }

    function _getInstrumentData($db, $excludeMetaData = false)
    {
        $result = $db->pselect(
            "SELECT * FROM $this->table WHERE CommentID=:CID",
            array('CID' => $this->getCommentID())
        );

        if ($excludeMetaData && $result) {
            unset($result[0]['CommentID']);
            unset($result[0]['UserID']);
            unset($result[0]['Testdate']);
            unset($result[0]['Data_entry_completion_status']);
        }

        return $result ? $result[0] : array();
    }


    function _getAgeWindows($db)
    {
        $query_params = array(
                         'TN'  => $this->testName,
                         'CID' => $this->getCommentID(),
                        );

        $Windows = $db ->pselect(
            "SELECT AgeMinDays, AgeMaxDays
                FROM test_battery tb
                    JOIN flag f USING(Test_name)
                    JOIN session s ON (s.ID=f.SessionID)
                WHERE tb.Active='Y' AND tb.Test_name=:TN
                    AND tb.SubprojectID=s.SubprojectID
                    AND f.CommentID=:CID",
            $query_params
        );

        return $Windows;
    }


    /**
     * @param string  $filename The filename to be loaded, or a base64 encoded
     *                          string of a .json file to be interpreted.
     * @param boolean $base64   (NOT IMPLEMENTED) If true, read the filename as a base64 encoded
     *                          string of the file content, used for preview
     *                          when no file has yet been saved to the
     *                          instruments/ directory
     *
     * @return json   returns the instrument from the .json
     */
    function loadInstrumentFile($filename, $base64 = false)
    {
        if (!preg_match('/.json$/', $filename)) {
            return;
        }
        if (file_exists($filename) || $base64 === true) {
            $this->InstrumentType = 'JSON';
            $json = file_get_contents($filename);
            $this->instrumentJSON = $json;
            $this->instrument     = json_decode($json, true);
            $this->instrument["Elements"] = self::inlineCalcFormulas($this->instrument["Elements"]);
            $this->table    = $this->instrument['Meta']['ShortName'];
            $this->testName = $this->table;
            return $json;
        }
    }

    static function isRequired($element, $values, $context)
    {
        $inputTypes = [
                       'select',
                       'date',
                       'radio',
                       'text',
                       'calc',
                       'checkbox',
                      ];

        if (!in_array($element["Type"], $inputTypes)) { return false;
        }

        $requireResponse = $element["Options"]["RequireResponse"] ?? null;
        if (!isset($requireResponse)) { return false;
        }

        if (is_bool($requireResponse)) { return $requireResponse;
        }

        return \LorisScript\Evaluator::evaluate($requireResponse, array_merge($values, $context));
    }

    static function isDisplayedOnForm($element, $values, $context, $isCalc = false)
    {
        $displayIf    = true;
        $hiddenSurvey = false;
        $hidden       = false;

        if ($element["DisplayIf"] != '' && !preg_match('/\A\s*\z/', $element["DisplayIf"])) {
            try {
                $displayIf = \LorisScript\Evaluator::evaluate($element["DisplayIf"], array_merge($values, $context));
            } catch (\Exception $e) {
                error_log($e->getMessage());
            }
        }

        if (isset($_REQUEST['key']) && ($element["HiddenSurvey"] != '' && !preg_match('/\A\s*\z/', $element["HiddenSurvey"]))) { //is survey and not blank
            try {
                $hiddenSurvey = \LorisScript\Evaluator::evaluate($element["HiddenSurvey"], array_merge($values, $context));
            } catch (\Exception $e) {
                error_log($e->getMessage());
            }
        }

        if ($element["Hidden"] != '' && !preg_match('/\A\s*\z/', $element["Hidden"])) {
            try {
                $hidden = \LorisScript\Evaluator::evaluate($element["Hidden"], array_merge($values, $context));
            } catch (\Exception $e) {
                error_log($e->getMessage());
            }
        }

        if ($isCalc) { return $displayIf;
        }
        else { return $displayIf && !$hidden && !$hiddenSurvey;
        }
    }

    function incompleteExists($values)
    {
        $incompleteExists = false;
        foreach ($this->instrument["Elements"] as &$element) {
            if (!isset($element["Name"])) {
                continue;
            } elseif (isset($values[$element["Name"]])) {
                continue;
            } else {
                $isRequired  = self::isRequired($element, $values, $this->_getContext($values['Date_taken'] ?? null));
                $isDisplayed = self::isDisplayedOnForm($element, $values, $this->_getContext($values['Date_taken'] ?? null));
                if ($isRequired && $isDisplayed) {
                    $incompleteExists = true;
                    return $incompleteExists;
                }
            }
        }
        return $incompleteExists;
    }

    function calcFieldsMatch($values)
    {
        $match   = true;
        $context = $this->_getContext($values['Date_taken'] ?? null);
        foreach ($this->instrument["Elements"] as &$element) {
            $calculatedValue = null;
            if ($element["Type"] == 'calc' && $this->isDisplayedOnForm($element, $values, $context, true)) {
                $frontEndValue = $values[$element['Name']];
                try {
                    $calculatedValue = \LorisScript\Evaluator::evaluate($element["Formula"], array_merge($values, $context));
                } catch (\Exception $e) {
                    error_log($e->getMessage());
                }
                if ($calculatedValue != $frontEndValue) {
                    $match = false;
                    error_log("Backend calc does not match front end calc for element ${element['Name']}");
                }
            }
        }

        return $match;
    }

    /**
     * Returns a JSON representation of the currently instantiated
     * instrument.
     *
     * The format of the JSON representation is specified in the
     * docs/API/InstrumentFormat documentation.
     *
     * @return string containing valid JSON
     */
    function toJSON()
    {
        return json_encode($this->instrument);
    }

    function display()
    {
        $db =& \Database::singleton();

        $smarty = new \Smarty_NeuroDB();
        $smarty->assign('instrumentJSON', htmlspecialchars($this->toJSON()));

        $initialData = $this->_getInstrumentData($db, true);
        $smarty->assign('initialData', htmlspecialchars(json_encode($initialData)));

        $context = $this->_getContext();
        if ($initialData['Candidate_Age']) {
            $context['age_mths'] = $initialData['Candidate_Age'];
        }
        $smarty->assign('context', htmlspecialchars(json_encode($context)));

        $smarty->assign('lang', htmlspecialchars($this->_getLang()));
        $smarty->assign('complete', htmlspecialchars($this->_isComplete()));

        $examiners = $this->_getExaminerNames();
        reset($examiners);
        unset($examiners[key($examiners)]);
        $smarty->assign('examiners', htmlspecialchars(json_encode($examiners)));

        $smarty->assign('agewindows', htmlspecialchars(json_encode($this->_getAgeWindows($db))));

        $html = $smarty->fetch("instrument_react.tpl");
        return $html;
    }

    function save()
    {
        $db =& \Database::singleton();
        $isDataSubmission = isset($_POST['instrumentData']);
        $calcFieldsMatch  = true;
        $incompleteExists = false;
        if ($isDataSubmission) {
            $frontEndValues = json_decode($_POST['instrumentData'], true);
            if (!$this->calcFieldsMatch($frontEndValues)) {
                $calcFieldsMatch = false;
                return false;
            }
            $values = $frontEndValues;
            if ($this->incompleteExists($values)) {
                $incompleteExists = true;
                $this->_setDataEntryCompletionStatus('Incomplete');
                return false;
            }
        } else {
            $values = array();
        }
        $recordExists = !empty(
            $db->pselect(
                "SELECT * FROM $this->table WHERE CommentID=:CID",
                array('CID' => $this->getCommentID())
            )
        );
        if (!$recordExists) {
            $db->insert(
                $this->table,
                array_merge($values, array('CommentID' => $this->getCommentID())),
                array('CommentID' => $this->getCommentID())
            );
            $this->_saveCandidateAge($values);
        } else if ($recordExists && !empty($values)) {
            $this->_saveCandidateAge($values);
            $db->update(
                $this->table,
                $values,
                array('CommentID' => $this->getCommentID())
            );
        }

        if (!$incompleteExists && $calcFieldsMatch) {
            $this->_setDataEntryCompletionStatus('Complete');
        }
        return true;
    }

    static private function checkForCircularRefs($formulaMap)
    {
        foreach ($formulaMap as $key => $formula) {
            $encounteredVars = [];
            array_push($encounteredVars, $key);
            $res = self::referenceTree($formula, $formulaMap, $encounteredVars);
            if($res !== false) {
                throw new Exception("Circular reference at $res");
            }
        }
    }

    static private function referenceTree($formula, $formulaMap, $encounteredVars)
    {
        preg_match_all("/\[\w+\]*/", $formula, $matches);

        $variables = array_unique(
            array_map(
                function ($match) {
                    return substr($match, 1, -1);
                },
                $matches[0]
            )
        );

        foreach ($variables as $variable) {
            if (array_key_exists($variable, $formulaMap)) {
                if (in_array($variable, $encounteredVars)) {
                    return "$variable";
                }

                array_push($encounteredVars, $variable);

                return self::referenceTree($formulaMap[$variable], $formulaMap, $encounteredVars);
            }
        }

        return false;
    }

    static function inlineCalcFormulas($elements)
    {
        $calcElements = array_filter(
            $elements,
            function ($element) {
                return $element["Type"] === 'calc';
            }
        );

        $formulaMap = array_reduce(
            $calcElements,
            function ($result, $element) {
                $result[$element["Name"]] = $element["Formula"];
                return $result;
            },
            array()
        );

        self::checkForCircularRefs($formulaMap);

        return array_map(
            function ($element) use ($formulaMap) {
                if ($element["Type"] !== 'calc') { return $element;
                }
                $recusivelyInlinedFormula = $element["Formula"];
                $resultIsSame = false;
                while (!$resultIsSame) {
                    $result       = self::inlineSubFormulas($recusivelyInlinedFormula, $formulaMap);
                    $resultIsSame = $result === $recusivelyInlinedFormula;
                    $recusivelyInlinedFormula = $result;
                }
                $element["Formula"] = $recusivelyInlinedFormula;
                return $element;
            },
            $elements
        );
    }

    static private function inlineSubFormulas($formula, $formulaMap)
    {
        preg_match_all("/\[\w+\]*/", $formula, $matches);

        $variables = array_map(
            function ($match) {
                return substr($match, 1, -1);
            },
            $matches[0]
        );

        $inlinedFormula = array_reduce(
            $variables,
            function ($result, $variable) use ($formulaMap) {
                if (array_key_exists($variable, $formulaMap)) {
                    return preg_replace("/\[{$variable}\]/", "({$formulaMap[$variable]})", $result);
                } else {
                    return $result;
                }
            },
            $formula
        );

        return $inlinedFormula;
    }
}

?>
