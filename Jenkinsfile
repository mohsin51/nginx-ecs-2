


node {
    withEnv(['VERSION=latest',
             'PROJECT=nginx-ecs',
             'IMAGE=nginx-ecs',
             'ECRURL=http://308106623039.dkr.ecr.us-east-1.amazonaws.com',
             'ECRCRED=ecr:us-east-1:AWS_CRED',
             'CLUSTER=ECS-CLUSTER-2',
             'SERVICE=nginx-service',
             'REGION=us-east-1'
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
                    sh("sed -i 's|{{VERSION}}|$VERSION|' taskdef.json")

                    def TASKARN = sh(returnStdout: true,script:"/usr/local/bin/aws ecs register-task-definition --cli-input-json file://taskdef.json --region $REGION | jq -r .taskDefinition.taskDefinitionArn")
                    sh """
                        /usr/local/bin/aws ecs update-service --cluster $CLUSTER --service $SERVICE  --region $REGION --task-definition $TASKARN
                    """
                    
                } catch(exc) {
                    throw exc
                }
            }      
        }        
    } 
}