import * as path from 'path';
import { Stack } from 'aws-cdk-lib';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import { Construct } from 'constructs';
import * as builder from '../../lib/index'
import * as process from 'process';




export class TestDockerImageStack extends Stack {
    constructor(scope: Construct, id: string) {
        super(scope, id);

        const repo = new ecr.Repository(this, 'MyTestRepostitory', {
            repositoryName: 'testrepo',
          });

          new builder.EcrImageBuilder(this, 'TestImageBuilder', {
            source: builder.DockerImageSource.directory(path.join(process.cwd(), '/test/', 'dockerfiles/node18')),
            destination: builder.EcrImageDestination.ecr(repo, {
                tag: 'latest'
            })
          }); 
    }
}

