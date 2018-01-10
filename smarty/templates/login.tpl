<div class="container">
  <div class="row">
    <section class="col-md-4 col-md-push-8">
      <div class="panel panel-default login-panel">
        <div class="panel-heading">
          <h3 class="panel-title">Login to LORIS</h3>
        </div>
        <div class="panel-body">
            {if $study_logo}
              <section class="study-logo">
                <img src="{$baseurl}/{$study_logo}" alt="{$study_title}"/>
              </section>
            {/if}
          <form action="/main.php?" method="post">
              {if $error_message}
                <span id="helpBlock" class="help-block">
                    <b class="text-danger">{$error_message}</b>
                </span>
              {/if}
            <input name="username" value="public" type="hidden"/>
            <input type="password" name="password" class="form-control" placeholder="Password" aria-describedby="helpBlock" />
            <center>
              <input class="btn btn-primary" name="login" type="submit" value="Click to enter" />
            </center>
          </form>
          <div class="help-text">
            A WebGL-compatible browser is required for full functionality (Mozilla Firefox, Google Chrome)
          </div>
        </div>
      </div>
    </section>
    <section class="col-md-8 col-md-pull-4">
      <div class="panel panel-default study-panel">
        <div class="panel-heading">
          <h3 class="panel-title">{$study_title}</h3>
        </div>
        <div class="panel-body">
          <section class="study-description">
            <p>{$study_description}</p>
          </section>
        </div>
      </div>
    </section>
  </div>
</div>
