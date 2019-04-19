import com.lloydsbanking.*

node() {
  stage('setup'){
    checkout(scm)
    env.PATH = "${tool('node-8.9.4')}/bin:${env.PATH}"
    env.PATH = "${tool('cf-6.32.0')}:${env.PATH}"
    sh("npm config set cafile=${env.CERTIFICATES_LOCATION}");
    sh("npm config set registry ${env.NPM_REGISTRY}")
    withCredentials([usernamePassword(credentialsId: 'bluemix', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]){
      sh("cf login -a https://api.lbg.eu-gb.bluemix.net -u $USERNAME -p $PASSWORD")
    }
  }

  stage('Check Branch Access') {
   if(env.CHANGE_TARGET == "master"
      && (env.CHANGE_BRANCH != "develop" &&
      !env.CHANGE_BRANCH.startsWith("hotfix"))) {
      error('Only develop or hotfix can merge to master')
    }
  }

  if (env.BRANCH_NAME.startsWith("PR-")
    && env.CHANGE_TARGET != "master") {
    stage('Build'){
      sh('npm i')
      sh('npm run dist')
    }

    stage('Check Version') {
      sh('npm run tool -- version-verify')
    }

    stage('Lint') {
      sh('npm run lint')
      sh('npm run format:verify')
    }

    stage('Unit Tests') {
      sh('npm run test:coverage')
    }

    if (env.BRANCH_NAME.startsWith("PR-")) {
    stage('Upload Coverage Reports To Nexus'){
      withCredentials([usernamePassword(credentialsId: 'nexus', usernameVariable: 'NEXUS_USER', passwordVariable: 'NEXUS_PASS')]){
        sh("npm run tool -- upload-artefact -d coverage -s coverage -n https://nexus.sandbox.extranet.group/nexus/content/repositories/reports/tooling -u $NEXUS_USER -p $NEXUS_PASS")
      }
    }
    stage("Add Coverage reports to jenkins"){
      publishHTML([allowMissing: false, alwaysLinkToLastBuild: false, keepAll: true, reportDir: 'coverage/lcov-report', reportFiles: 'index.html', reportName: 'Unit Test Coverage', reportTitles: ''])
    }
    }
    

    stage('Api Tests') {
      sh("npm run deploy:ci")
      def manifest = readYaml file: 'manifest.yml'
      sh("NODE_ENV=${manifest.env.NODE_ENV} API_SECRET=${manifest.env.API_SECRET} API_KEY=${manifest.env.API_KEY} CBAAS_VERSION=${manifest.env.CBAAS_DEFAULT_VERSION} AUTH_SERVICE_URL=https://sc-caf-service-authentication-cbaas-data-review.lbg.eu-gb.mybluemix.net/ SERVICE_URL=https://sc-caf-service-review-cbaas-data-review.lbg.eu-gb.mybluemix.net/ CONTEXT_SERVICE_URL=https://sc-caf-service-context-cbaas-data-review.lbg.eu-gb.mybluemix.net/ STORE_CLOUDANT_URL=https://3c5ea03c-8eb2-458f-9ca0-d3c3b760159a-bluemix:599702fd7ed77bc96faef2bda6cd7f59883072a827dd31dfbee7205a79d478b5@3c5ea03c-8eb2-458f-9ca0-d3c3b760159a-bluemix.cloudant.com/ npm run test:component")
      archiveArtifacts artifacts: 'tests/API/reports/index.html, tests/API/reports/cucumber-report.json', fingerprint: true
      cucumber buildStatus: 'UNSTABLE',
        jsonReportDirectory: 'tests/API/reports/',
        fileIncludePattern: 'cucumber-report.json',
        trendsLimit: 10
    }

    if (env.BRANCH_NAME.startsWith("PR-")) {
    stage('Upload Cucumber Reports To Nexus'){
      withCredentials([usernamePassword(credentialsId: 'nexus', usernameVariable: 'NEXUS_USER', passwordVariable: 'NEXUS_PASS')]){
        sh("npm run tool -- upload-artefact -d tests/API/reports -s cucumber -n https://nexus.sandbox.extranet.group/nexus/content/repositories/reports/tooling -u $NEXUS_USER -p $NEXUS_PASS")
      }
    }
    }
  

  if (env.BRANCH_NAME == "develop" ||
      env.CHANGE_BRANCH.startsWith("hotfix")) {
    stage('Create release-candidate artefact') {
      withCredentials([usernamePassword(credentialsId: 'nexus', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]){
        sh("npm run tool -- upload-artefact -u $USERNAME -p $PASSWORD")
      }
    }
      }

    stage('Tag repo with package version') {
      sh('git tag -f "rc-"$(node -p "require(\'./package.json\').version")')
    }
  } else if (env.BRANCH_NAME == "master") {
    stage('Promote artefact to releases') {
      withCredentials([usernamePassword(credentialsId: 'nexus', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]){
        sh("npm run tool -- promote-artefact -u $USERNAME -p $PASSWORD")
      }
    }
  }
}

