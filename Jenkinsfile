


node {
    withEnv(['VERSION=latest',
             'PROJECT=nginx-ecs',
             'IMAGE=nginx-ecs',
             'ECRURL=http://308106623039.dkr.ecr.us-east-1.amazonaws.com',
             'ECRCRED=ecr:us-east-1:AWS_CRED' 
             ]) {

        stage('checkout scm'){
            git 'https://github.com/mohsin51/nginx-ecs-2'
        }
        stage('build docker images'){
            script {
                try {
                    gitCommitHash = sh(returnStdout: true, script: 'git rev-parse HEAD').trim()
                    def VERSION =gitCommitHash.take(7)

                    sh('docker stop $(docker ps -aq)')

                    sh  """   
                        export IMGTAG=$VERSION 
                        docker-compose build --no-cache
                        docker images
                    """
                } catch(exce) {
                    sh 'docker-compose down'
                    throw exce
                }
            }
        }
        stage('push images to ecr'){
            script
            {
                try {
                    AWS_ACCESS_KEY_ID=credentials('jenkins-aws-secret-key-id')
                    AWS_SECRET_ACCESS_KEY=credentials('jenkins-aws-secret-access-key')
                    sh  '''
                        /usr/local/bin/aws ecr get-login --no-include-email | sh
                    '''

                    gitCommitHash = sh(returnStdout: true, script: 'git rev-parse HEAD').trim()
                    def VERSION =gitCommitHash.take(7)


                    docker.withRegistry("$ECRURL", "$ECRCRED")   
                    {
                        docker.image("$IMAGE:$VERSION").push("$VERSION")
                    }
                    sh """
                        /usr/local/bin/aws cloudformation update-stack --stack-name task --use-previous-template --parameters ParameterKey=VERSION,ParameterValue=$VERSION
                        /usr/local/bin/aws ecs update-service --cluster ECS-CLUSTER-2 --service nginx-service --task-definition nginx-task-ecs-demo-app:2
                    """
                    
                } catch(exc) {
                    throw exc
                }
            }      
        }        
    } 
}