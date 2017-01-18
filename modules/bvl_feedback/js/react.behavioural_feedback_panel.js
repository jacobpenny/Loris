!function(e){function n(a){if(t[a])return t[a].exports;var r=t[a]={exports:{},id:a,loaded:!1};return e[a].call(r.exports,r,r.exports,n),r.loaded=!0,r.exports}var t={};return n.m=e,n.c=t,n.p="",n(0)}({0:function(e,n,t){t(1)(t(10))},1:function(e,n){e.exports=function(e){"undefined"!=typeof execScript?execScript(e):eval.call(null,e)}},10:function(e,n){e.exports='/* exported RBehaviouralFeedbackPanel */\n\nvar SliderPanel = React.createClass({\n  displayName: "SliderPanel",\n\n  render: function render() {\n    return React.createElement(\n      "div",\n      { className: "panel-group", id: "bvl_feedback_menu" },\n      React.createElement(\n        "div",\n        { className: "breadcrumb-panel" },\n        React.createElement(\n          "a",\n          { className: "info" },\n          "Feedback for PSCID: ",\n          this.props.pscid\n        )\n      ),\n      this.props.children\n    );\n  }\n});\n\nvar FeedbackPanelContent = React.createClass({\n  displayName: "FeedbackPanelContent",\n\n  propTypes: {\n    feedbackLevel: React.PropTypes.string.isRequired\n  },\n  getInitialState: function getInitialState() {\n    return {\n      currentEntryToggled: null\n    };\n  },\n  markCommentToggle: function markCommentToggle(index) {\n    if (index === this.state.currentEntryToggled) {\n      this.setState({\n        currentEntryToggled: null\n      });\n    } else {\n      this.setState({\n        currentEntryToggled: index\n      });\n    }\n  },\n  openThread: function openThread(index) {\n    this.props.open_thread(index);\n  },\n  closeThread: function closeThread(index) {\n    this.props.close_thread(index);\n    this.setState({\n      currentEntryToggled: null\n    });\n  },\n\n  render: function render() {\n    var headers = ["Type", "Author", "Status"];\n\n    if (this.props.feedbackLevel === "instrument") {\n      headers[0] = "Fieldname";\n    }\n\n    var tableHeaders = React.createElement(\n      "tr",\n      { className: "info" },\n      headers.map(function (header, key) {\n        return React.createElement(\n          "td",\n          { key: key },\n          header\n        );\n      })\n    );\n\n    if (this.props.threads.length) {\n      var currentEntryToggled = this.state.currentEntryToggled;\n      var feedbackRows = this.props.threads.map(function (row, index) {\n        var thisRowCommentToggled = currentEntryToggled === index;\n        return React.createElement(FeedbackPanelRow, {\n          key: row.FeedbackID,\n          commentToggled: thisRowCommentToggled,\n          feedbackID: row.FeedbackID,\n          sessionID: this.props.sessionID,\n          type: row.Type,\n          commentID: this.props.commentID,\n          candID: this.props.candID,\n          status: row.QCStatus,\n          date: row.Date,\n          commentToggle: this.markCommentToggle.bind(null, index),\n          fieldname: row.FieldName,\n          author: row.User,\n          onClickClose: this.closeThread.bind(null, index),\n          onClickOpen: this.props.open_thread.bind(null, index)\n        });\n      }.bind(this));\n\n      var table = React.createElement(\n        "table",\n        {\n          id: "current_thread_table",\n          className: "table table-hover table-bordered dynamictable"\n        },\n        React.createElement(\n          "thead",\n          { id: "current_thread_table_header" },\n          tableHeaders\n        ),\n        feedbackRows\n      );\n\n      return React.createElement(\n        "div",\n        { className: "panel-collapse collapse in" },\n        React.createElement(\n          "div",\n          { className: "panel-body" },\n          table\n        )\n      );\n    }\n\n    return React.createElement(\n      "div",\n      { className: "panel-body" },\n      "There are no threads for this user!"\n    );\n  }\n});\n\nvar FeedbackPanelRow = React.createClass({\n  displayName: "FeedbackPanelRow",\n\n  getInitialState: function getInitialState() {\n    return {\n      threadEntriesToggled: false,\n      threadEntriesLoaded: []\n    };\n  },\n  componentDidMount: function componentDidMount() {\n    this.loadServerState();\n  },\n  loadServerState: function loadServerState() {\n    var that = this;\n\n    $.ajax({\n      type: "GET",\n      url: loris.BaseURL + "/bvl_feedback/ajax/get_thread_entry_data.php",\n      data: { feedbackID: this.props.feedbackID },\n      success: function success(data) {\n        that.setState({ threadEntriesLoaded: data });\n      },\n      error: function error(xhr, desc, err) {\n        console.error(xhr);\n        console.error("Details: " + desc + "\\nError:" + err);\n      }\n    });\n  },\n  toggleEntries: function toggleEntries(newComment) {\n    var toggle = false;\n    if (newComment) {\n      toggle = true;\n    } else {\n      toggle = !this.state.threadEntriesToggled;\n    }\n    this.setState({ threadEntriesToggled: toggle });\n  },\n  newThreadEntry: function newThreadEntry(comment) {\n    var feedbackID = this.props.feedbackID;\n    var candID = this.props.candID;\n\n    $.ajax({\n      type: "POST",\n      url: loris.BaseURL + "/bvl_feedback/ajax/thread_comment_bvl_feedback.php",\n      data: {\n        comment: comment,\n        feedbackID: feedbackID,\n        candID: candID\n      },\n      success: function (response) {\n        this.loadServerState();\n        // end of success function\n      }.bind(this),\n      error: function error(xhr, desc, err) {\n        console.error(xhr);\n        console.error("Details: " + desc + "\\nError:" + err);\n      }\n    });\n  },\n  render: function render() {\n    var arrow = \'glyphicon glyphicon-chevron-right glyphs\';\n    var threadEntries = [];\n\n    var buttonText = \'closed\';\n    var buttonClass = \'btn btn-success dropdown-toggle btn-sm\';\n    var dropdown = React.createElement(\n      "li",\n      null,\n      React.createElement(\n        "a",\n        { onClick: this.props.onClickOpen },\n        "Open"\n      )\n    );\n    var commentButton = void 0;\n\n    if (this.state.threadEntriesToggled) {\n      arrow = \'glyphicon glyphicon-chevron-down glyphs\';\n      threadEntries = this.state.threadEntriesLoaded.map(function (entry, key) {\n        return React.createElement(\n          "tr",\n          { key: key, className: "thread_entry" },\n          React.createElement(\n            "td",\n            { colSpan: "100%" },\n            entry.UserID,\n            " on ",\n            entry.TestDate,\n            " commented:",\n            React.createElement("br", null),\n            entry.Comment\n          )\n        );\n      });\n    }\n\n    if (this.props.status === \'opened\') {\n      buttonText = \'opened\';\n      buttonClass = \'btn btn-danger dropdown-toggle btn-sm\';\n      dropdown = React.createElement(\n        "li",\n        null,\n        React.createElement(\n          "a",\n          { onClick: this.props.onClickClose },\n          "Close"\n        )\n      );\n      commentButton = React.createElement("span", { className: "glyphicon glyphicon-pencil",\n        onClick: this.props.commentToggle });\n    }\n\n    return React.createElement(\n      "tbody",\n      null,\n      React.createElement(\n        "tr",\n        null,\n        this.props.fieldname ? React.createElement(\n          "td",\n          null,\n          this.props.fieldname,\n          React.createElement("br", null),\n          this.props.type\n        ) : React.createElement(\n          "td",\n          null,\n          this.props.type\n        ),\n        React.createElement(\n          "td",\n          null,\n          this.props.author,\n          " on:",\n          React.createElement("br", null),\n          this.props.date\n        ),\n        React.createElement(\n          "td",\n          null,\n          React.createElement(\n            "div",\n            { className: "btn-group" },\n            React.createElement(\n              "button",\n              { name: "thread_button", type: "button", className: buttonClass,\n                "data-toggle": "dropdown", "aria-haspopup": "true",\n                "aria-expanded": "false" },\n              buttonText,\n              React.createElement("span", { className: "caret" })\n            ),\n            React.createElement(\n              "ul",\n              { className: "dropdown-menu" },\n              dropdown\n            )\n          ),\n          React.createElement("span", { className: arrow,\n            onClick: this.toggleEntries.bind(this, false) }),\n          commentButton\n        )\n      ),\n      this.props.commentToggled ? React.createElement(CommentEntryForm, {\n        user: this.props.user,\n        onCommentSend: this.newThreadEntry,\n        toggleThisThread: this.toggleEntries.bind(this, true)\n      }) : null,\n      threadEntries\n    );\n  }\n});\n\nvar CommentEntryForm = React.createClass({\n  displayName: "CommentEntryForm",\n\n  getInitialState: function getInitialState() {\n    return {\n      value: \'\'\n    };\n  },\n  sendComment: function sendComment() {\n    this.props.onCommentSend(this.state.value);\n    this.setState({\n      value: "Comment added!"\n    });\n    this.props.toggleThisThread();\n  },\n  handleChange: function handleChange(event) {\n    this.setState({ value: event.target.value });\n  },\n  render: function render() {\n    return React.createElement(\n      "tr",\n      null,\n      React.createElement(\n        "td",\n        { colSpan: "100%" },\n        "Add a thread entry:",\n        React.createElement(\n          "div",\n          { className: "input-group", style: { width: \'100%\' } },\n          React.createElement("textarea", {\n            className: "form-control",\n            value: this.state.value,\n            style: { resize: \'none\' },\n            rows: "2",\n            ref: "threadEntry",\n            onChange: this.handleChange }),\n          React.createElement(\n            "span",\n            {\n              className: "input-group-addon btn btn-primary",\n              onClick: this.sendComment\n            },\n            "Send"\n          )\n        )\n      )\n    );\n  }\n\n});\n\nvar AccordionPanel = React.createClass({\n  displayName: "AccordionPanel",\n\n  getInitialState: function getInitialState() {\n    return {\n      toggled: false\n    };\n  },\n  toggleChange: function toggleChange() {\n    this.setState({\n      toggled: !this.state.toggled\n    });\n  },\n  render: function render() {\n    var panelBodyClass = "panel-collapse collapse in";\n    var arrowClass = void 0;\n\n    if (this.state.toggled) {\n      panelBodyClass = "panel-collapse collapse";\n      arrowClass = "collapsed";\n    }\n\n    return React.createElement(\n      "div",\n      { className: "panel-group", id: "accordion" },\n      React.createElement(\n        "div",\n        { className: "panel panel-default" },\n        React.createElement(\n          "div",\n          { className: "panel-heading" },\n          React.createElement(\n            "h4",\n            { className: "panel-title" },\n            React.createElement(\n              "a",\n              { className: arrowClass, onClick: this.toggleChange },\n              this.props.title\n            )\n          )\n        ),\n        React.createElement(\n          "div",\n          { className: panelBodyClass },\n          this.props.children\n        )\n      )\n    );\n  }\n});\n\nvar NewThreadPanel = React.createClass({\n  displayName: "NewThreadPanel",\n\n  propTypes: {\n    selectOptions: React.PropTypes.object\n  },\n  getInitialState: function getInitialState() {\n    return {\n      textValue: \'\',\n      selectValue: \'Across All Fields\',\n      inputValue: 1\n    };\n  },\n  handleSelectChange: function handleSelectChange(event) {\n    this.setState({ selectValue: event.target.value });\n  },\n  handleTextChange: function handleTextChange(event) {\n    this.setState({ textValue: event.target.value });\n  },\n  handleInputChange: function handleInputChange(event) {\n    this.setState({ inputValue: event.target.value });\n  },\n  createNewThread: function createNewThread() {\n    if (this.state.textValue.length) {\n      $.ajax({\n        type: "POST",\n        url: loris.BaseURL + "/bvl_feedback/ajax/new_bvl_feedback.php",\n        data: {\n          inputType: this.state.inputValue,\n          fieldName: this.state.selectValue,\n          comment: this.state.textValue,\n          candID: this.props.candID,\n          sessionID: this.props.sessionID,\n          commentID: this.props.commentID,\n          user: this.props.commentID\n        },\n        success: function (data) {\n          this.setState({ textValue: "The new thread has been submitted!" });\n          this.props.addThread(data);\n          this.props.updateSummaryThread();\n        }.bind(this),\n        error: function error(xhr, desc, err) {\n          console.error(xhr);\n          console.error("Details: " + desc + "\\nError:" + err);\n        }\n      });\n    }\n  },\n  render: function render() {\n    var fieldnameSelect;\n    var options = [];\n    for (var _key in this.props.selectOptions) {\n      if (this.props.selectOptions.hasOwnProperty(_key)) {\n        options.push(React.createElement(\n          "option",\n          { key: _key, value: _key },\n          this.props.selectOptions[_key]\n        ));\n      }\n    }\n\n    if (this.props.feedbackLevel === "instrument") {\n      fieldnameSelect = React.createElement(\n        "div",\n        { className: "form-group" },\n        React.createElement(\n          "div",\n          { className: "row" },\n          React.createElement(\n            "label",\n            { className: "col-xs-4" },\n            "Field Name"\n          ),\n          React.createElement(\n            "div",\n            { className: "col-xs-8" },\n            React.createElement(\n              "select",\n              {\n                className: "form-control",\n                name: "inputType",\n                selected: this.state.selectValue,\n                onChange: this.handleSelectChange\n              },\n              options\n            )\n          )\n        )\n      );\n    }\n\n    var feedbackTypes = this.props.feedbackTypes;\n    var input = [];\n    for (var key in feedbackTypes) {\n      if (feedbackTypes.hasOwnProperty(key)) {\n        input.push(React.createElement(\n          "option",\n          { key: key, value: feedbackTypes[key].Type },\n          feedbackTypes[key].Label\n        ));\n      }\n    }\n\n    return React.createElement(\n      "div",\n      { className: "panel-body", id: "new_feedback" },\n      React.createElement(\n        "div",\n        { className: "form-group" },\n        React.createElement("textarea", {\n          className: "form-control",\n          rows: "4",\n          id: "comment",\n          value: this.state.textValue,\n          onChange: this.handleTextChange })\n      ),\n      fieldnameSelect,\n      React.createElement(\n        "div",\n        { className: "form-group" },\n        React.createElement(\n          "div",\n          { className: "row" },\n          React.createElement(\n            "label",\n            { className: "col-xs-4" },\n            "Feedback Type"\n          ),\n          React.createElement(\n            "div",\n            { className: "col-xs-8" },\n            React.createElement(\n              "select",\n              {\n                name: "input",\n                selected: this.state.inputValue,\n                onChange: this.handleInputChange,\n                className: "form-control"\n              },\n              input\n            )\n          )\n        )\n      ),\n      React.createElement(\n        "div",\n        { className: "form-group" },\n        React.createElement(\n          "button",\n          {\n            id: "save_data",\n            onClick: this.createNewThread,\n            className: "btn btn-default pull-right btn-sm"\n          },\n          "Save data"\n        )\n      )\n    );\n  }\n});\n\nvar FeedbackSummaryPanel = React.createClass({\n  displayName: "FeedbackSummaryPanel",\n\n  getInitialState: function getInitialState() {\n    return {\n      summary: null\n    };\n  },\n  render: function render() {\n    var summaryRows = [];\n\n    if (this.props.summary_data) {\n      summaryRows = this.props.summary_data.map(function (row, key) {\n        return React.createElement(\n          "tr",\n          { key: key },\n          React.createElement(\n            "td",\n            null,\n            row.QC_Class\n          ),\n          React.createElement(\n            "td",\n            null,\n            React.createElement(\n              "a",\n              { href: loris.BaseURL + "/" + row.Instrument + "/?candID=" + row.CandID + "&sessionID=" + row.SessionID + "&commentID=" + row.CommentID\n              },\n              row.Instrument\n            )\n          ),\n          React.createElement(\n            "td",\n            null,\n            React.createElement(\n              "a",\n              { href: loris.BaseURL + "/instrument_list/?candID=" + row.CandID + "&sessionID=" + row.SessionID\n              },\n              row.Visit\n            )\n          ),\n          React.createElement(\n            "td",\n            null,\n            row.No_Threads\n          )\n        );\n      });\n    }\n\n    if (summaryRows === undefined || summaryRows.length === 0) {\n      return React.createElement(\n        "div",\n        { className: "panel-body" },\n        "This candidate has no behavioural feedback."\n      );\n    }\n\n    return React.createElement(\n      "div",\n      { className: "panel-body" },\n      React.createElement(\n        "table",\n        {\n          className: "table table-hover table-bordered dynamictable" },\n        React.createElement(\n          "thead",\n          null,\n          React.createElement(\n            "tr",\n            { className: "info" },\n            React.createElement(\n              "th",\n              null,\n              "QC Class"\n            ),\n            React.createElement(\n              "th",\n              null,\n              "Instrument"\n            ),\n            React.createElement(\n              "th",\n              null,\n              "Visit"\n            ),\n            React.createElement(\n              "th",\n              null,\n              "# Threads"\n            )\n          )\n        ),\n        React.createElement(\n          "tbody",\n          null,\n          summaryRows\n        )\n      )\n    );\n  }\n});\n\nvar FeedbackPanel = React.createClass({\n  displayName: "FeedbackPanel",\n\n  getInitialState: function getInitialState() {\n    return {\n      threads: \'\',\n      summary: null\n    };\n  },\n  componentDidMount: function componentDidMount() {\n    this.loadThreadServerState();\n  },\n  loadSummaryServerData: function loadSummaryServerData() {\n    $.ajax({\n      type: "POST",\n      url: loris.BaseURL + "/bvl_feedback/ajax/get_bvl_feedback_summary.php",\n      data: {\n        candID: this.props.candID,\n        sessionID: this.props.sessionID,\n        commentID: this.props.commentID\n      },\n      success: function (data) {\n        this.setState({ summary: data });\n      }.bind(this),\n      error: function error(xhr, desc, err) {\n        console.error(xhr);\n        console.error("Details: " + desc + "\\nError:" + err);\n      }\n    });\n  },\n  loadThreadServerState: function loadThreadServerState() {\n    $.ajax({\n      type: "POST",\n      url: loris.BaseURL + "/bvl_feedback/ajax/react_get_bvl_threads.php",\n      data: {\n        candID: this.props.candID,\n        sessionID: this.props.sessionID,\n        commentID: this.props.commentID,\n        user: this.props.commentID\n      },\n      success: function (data) {\n        this.setState({ threads: data });\n        this.loadSummaryServerData();\n      }.bind(this),\n      error: function error(xhr, desc, err) {\n        console.error(xhr);\n        console.error("Details: " + desc + "\\nError:" + err);\n      }\n    });\n  },\n  addThread: function addThread(data) {\n    this.loadThreadServerState();\n  },\n  markThreadClosed: function markThreadClosed(index) {\n    var threads = this.state.threads;\n    var entry = this.state.threads[index];\n    threads.splice(index, 1);\n    var feedbackID = entry.FeedbackID;\n    entry.QCStatus = \'closed\';\n\n    threads.push(entry);\n\n    $.ajax({\n      type: "POST",\n      url: loris.BaseURL + "/bvl_feedback/ajax/close_bvl_feedback_thread.php",\n      data: {\n        candID: this.props.candID,\n        feedbackID: feedbackID\n      },\n      success: function (data) {\n        this.setState({ threads: threads });\n        this.loadSummaryServerData();\n      }.bind(this),\n      error: function error(xhr, desc, err) {\n        console.error(xhr);\n        console.error("Details: " + desc + "\\nError:" + err);\n      }\n    });\n  },\n  markThreadOpened: function markThreadOpened(index) {\n    var threads = this.state.threads;\n    var entry = this.state.threads[index];\n    var feedbackID = entry.FeedbackID;\n\n    entry.QCStatus = \'opened\';\n    threads.splice(index, 1);\n    threads.unshift(entry);\n\n    $.ajax({\n      type: "POST",\n      url: loris.BaseURL + "/bvl_feedback/ajax/open_bvl_feedback_thread.php",\n      data: {\n        candID: this.props.candID,\n        feedbackID: feedbackID\n      },\n      success: function (data) {\n        this.setState({ threads: threads });\n        this.loadSummaryServerData();\n      }.bind(this),\n      error: function error(xhr, desc, err) {\n        console.error(xhr);\n        console.error("Details: " + desc + "\\nError:" + err);\n      }\n    });\n  },\n  render: function render() {\n    var title = "New " + this.props.feedbackLevel + " level feedback";\n    return React.createElement(\n      SliderPanel,\n      { pscid: this.props.pscid },\n      React.createElement(\n        AccordionPanel,\n        { title: "Open Thread Summary" },\n        React.createElement(FeedbackSummaryPanel, { summary_data: this.state.summary })\n      ),\n      React.createElement(\n        AccordionPanel,\n        { title: title },\n        React.createElement(NewThreadPanel, {\n          selectOptions: this.props.selectOptions,\n          feedbackLevel: this.props.feedbackLevel,\n          candID: this.props.candID,\n          sessionID: this.props.sessionID,\n          commentID: this.props.commentID, addThread: this.addThread,\n          updateSummaryThread: this.loadSummaryServerData,\n          feedbackTypes: this.props.feedbackTypes\n        })\n      ),\n      React.createElement(\n        AccordionPanel,\n        { title: "Feedback Threads" },\n        React.createElement(FeedbackPanelContent, {\n          threads: this.state.threads,\n          close_thread: this.markThreadClosed,\n          open_thread: this.markThreadOpened,\n          feedbackLevel: this.props.feedbackLevel,\n          candID: this.props.candID,\n          sessionID: this.props.sessionID,\n          commentID: this.props.commentID\n        })\n      )\n    );\n  }\n});\n\nvar RBehaviouralFeedbackPanel = React.createFactory(FeedbackPanel);'}});