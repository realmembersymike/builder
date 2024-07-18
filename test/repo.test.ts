import { Stack } from "aws-cdk-lib";
import * as builder from '../lib/index';
import * as path from 'path';
import * as process from 'process';
import { Repository } from "aws-cdk-lib/aws-ecr";
import { Template, Match } from "aws-cdk-lib/assertions";

describe('builder: Should build an image', () => {
    const stack = new Stack();
    const image_path = path.join(process.cwd(), '/test/', 'dockerfiles/node18');
    describe('WHEN: Valid image source constructed', () => {

        const source = builder.DockerImageSource.directory(image_path);

        describe("WHEN: Valid ECR Repo Exists", () => {
            const repo = new Repository(stack, 'TestRepository');
            const destination = builder.EcrImageDestination.ecr(repo, {tag: 'latest'});

            new builder.EcrImageBuilder(stack, 'TestDeployment', {
                source,
                destination,
            });


            test('Codebuild - Should Exists and contain expected string in commandlist', () => {
                Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
                    Source: {
                        BuildSpec: {
                            'Fn::Join': Match.arrayWith([
                                Match.arrayWith([
                                    '",\n        "docker tag ',
                                ])
                            ])
                        }
                    }
                });
            });

        });
    
    })
});