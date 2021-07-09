# Demo application to show features

## How to run locally

There are run-dev and redis node script targets in the demo app. There's a run-dev in the soma app as well.

Those are set to run the soma app on port 8080 and the client app on port 8081. So you can then make requests to localhost:8080.

## Add the below environment variables manually to the demo app. (Need to do it only once)
TXL_PUBSUB_TOPIC = projects/ce-intrado-ccai-poc-sandbox-01/topics/transactional-logging-pubsub-topic

## Build and deploy

```ps1
function Build-CloudRunApp {
    # Build and deploy a Cloud Run app.
    param (
        [Parameter(Mandatory)]
        [string]$AppName,
        [Parameter(Mandatory)]
        [string]$AppVersion,
        [Parameter(Mandatory)]
        [string]$AppProjectId,
        [Parameter(Mandatory)]
        [string]$GCPRegion,
        [Parameter(Mandatory)]
        [string]$GCRProjectId
    )
    Set-PSDebug -Trace 1
    $Image = "us-docker.pkg.dev/$GCRProjectId/clients/${AppName}"
    docker build --no-cache --secret id=userconfig,src=$HOME/.npmrc -t "${AppName}:$AppVersion" -f Dockerfile .
    #docker run -d --env VERSION=$AppVersion --env ENV=preprod --env PORT=8081 --name $AppName -p 127.0.0.1:3001:8081 "${AppName}:$AppVersion"
    #docker stop $AppName
    Set-PSDebug -Trace 0
}
function Deploy-CloudRunApp {
    # Build and deploy a Cloud Run app.
    param (
        [Parameter(Mandatory)]
        [string]$AppName,
        [Parameter(Mandatory)]
        [string]$AppVersion,
        [Parameter(Mandatory)]
        [string]$AppProjectId,
        [Parameter(Mandatory)]
        [string]$GCPRegion,
        [Parameter(Mandatory)]
        [string]$GCRProjectId,
        [Parameter(Mandatory)]
        [string]$RedisHost,
        [Parameter(Mandatory)]
        [string]$RedisPort,
	    [Parameter(Mandatory)]
        [string]$Environment
    )
    $TxlPubSubTopic = "projects/ce-intrado-ccai-poc-sandbox-01/topics/transactional-logging-pubsub-topic"
    Build-CloudRunApp -AppName $AppName -AppVersion $AppVersion -AppProjectId $AppProjectId -GCPRegion $GCPRegion -GCRProjectId $GCRProjectId
    Set-PSDebug -Trace 1
    $Image = "us-docker.pkg.dev/$GCRProjectId/clients/${AppName}"
    docker tag "${AppName}:$AppVersion" "${Image}:$AppVersion"
    docker push "${Image}:$AppVersion"
    # TODO Only deploy if the build succeeded.
    #$Digest = ( gcloud --project $AppProjectId container images describe "${Image}:$AppVersion" --format=json | jq -r .image_summary.digest )
    gcloud --project $AppProjectId beta run deploy $AppName --image="${Image}:$AppVersion" --platform=managed --region=$GCPRegion --port=default --no-allow-unauthenticated --tag=$AppVersion --update-env-vars=ENV=$Environment --update-env-vars=VERSION=$AppVersion --update-env-vars=REDIS_HOST=${RedisHost} --update-env-vars=REDIS_PORT=${RedisPort} --update-env-vars=PROJECT_ID=${AppProjectId} --update-env-vars=TXL_PUBSUB_TOPIC=${TxlPubSubTopic} --revision-suffix=$AppVersion --vpc-connector=connector-$GCPRegion --service-account=cloudrun-sa@${AppProjectId}.iam.gserviceaccount.com
    # Future options to use:
    # '--set-env-vars=DEBUG="koa*,nerve:*,app:*",REDIS_URI="tcp://10.150.42.92:6379",VERSION="v0-1-0"'
    # --labels=client=example,app=example,version=example
    # --service-account=<todo>
    # --concurrency=80
    # --cpu=1
    # --memory=128Mi
    # --max-instances=10
    # --timeout=60s
    # --no-traffic
    #   gcloud run services update-traffic --to-latest
    Set-PSDebug -Trace 0
}
Deploy-CloudRunApp -AppName feature-demo -AppVersion v01 -AppProjectId iva-client-test1-prod -GCPRegion us-central1 -GCRProjectId ivr-divasp-prod-01 -RedisHost 10.220.98.155 -RedisPort 6379 -Environment dev
```

# Cloud build

## Prerequisite

1. We must have deployed Soma with the cloud build trigger.
2. We must have Redis and Node image present in the artifact registry in Prod environment (DIVA shared platform - prod).
3. We must have git authentication token created and enabled in the github account with respect to any member in the organization who has the npm-registry login to pull the 'ivap-nerve-neuron' repository.

------
##### *Note :- We have manually created the npm-token with shrikant.lahane@west.com account. We need to replace this token with organization account's token or one of IVA member's account.
------

## NPM Registry to build feature-demo
Visit github [documentation](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry) to know how we are using npm-registry to pull the neuron code.

## Setup permissions to pull images
We must manually add the artifact registry permissions to the [DIVA shared platform - prod - Artifact Registry](https://console.cloud.google.com/artifacts/browse/ivr-divasp-prod-01?project=ivr-divasp-prod-01)
1. Check on 'iva-product' then you'll see the permissions on the right.
2. Add Cloud build service account's email of all the projects from where we are pulling the image.
3. Add Artifact Registry Reader Role for the service account.
------
##### *Note :- As there are two different terraform projects ( client-setup-module & Iva-Infrastructure ) so we cannot access the project id from client-setup to iva-infrastructure as they are running differently. Therefore we are doing this manual process.
------