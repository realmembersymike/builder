// imports
import { Template, Match } from 'aws-cdk-lib/assertions';
import * as cdk from 'aws-cdk-lib/core';
import {TESTPHPDockerImageStack} from './integ/app';



describe('DockerImageDeploy', () => {
	const app = new cdk.App();

	const PHPDockerStack = new TESTPHPDockerImageStack(app, 'TestStack');

	// Prepare the stack for assertions.
	const template = Template.fromStack(PHPDockerStack);
	

	test('IAM::Role - Lambda', () => {
		template.hasResourceProperties('AWS::IAM::Role', {
			AssumeRolePolicyDocument: {
				Statement: Match.arrayWith([{
					Action: 'sts:AssumeRole',
					Effect: "Allow",
					Principal: { "Service": "lambda.amazonaws.com" }
				}])
			}
		});
	})


	test('IAM::Policy', () => {
		template.hasResourceProperties("AWS::IAM::Policy", {
			PolicyDocument: {
				Statement: Match.arrayWith([
						{
							Action: Match.arrayWith(
								[
									'ecr:BatchCheckLayerAvailability',
									'ecr:GetDownloadUrlForLayer',
									'ecr:BatchGetImage',
								]
							),
							Effect: "Allow" ,
							Resource: {
								"Fn::Join": [
									'',
									[
										"arn:",
										{ "Ref": "AWS::Partition" },
										":ecr:",
										{ "Ref": "AWS::Region" },
										":",
										{ "Ref": "AWS::AccountId" },
										":repository/",
										{ "Fn::Sub": "cdk-hnb659fds-container-assets-${AWS::AccountId}-${AWS::Region}" }
									],
								]
							}
						}
					])
				}
		});
	})
});