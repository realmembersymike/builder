# Builder

[![Build](https://github.com/realmembersymike/builder/actions/workflows/ci.yml/badge.svg)](https://github.com/realmembersymike/builder/actions/workflows/ci.yml)
[![Publish](https://github.com/realmembersymike/builder/actions/workflows/publish.yml/badge.svg)](https://github.com/realmembersymike/builder/actions/workflows/publish.yml)
[![codecov](https://codecov.io/github/realmembersymike/builder/graph/badge.svg?token=T7IZ1WWXPB)](https://codecov.io/github/realmembersymike/builder)  


See the [packages tab](https://github.com/realmembersymike/builder/pkgs/npm/builder) tab for latest version and installation info.

# CDK Abstraction - Composition

Composition is the key pattern for defining higher-level abstractions through constructs. A high-level construct can be composed from any number of lower-level constructs. From a bottom-up perspective, you use constructs to organize the individual AWS resources that you want to deploy. You use whatever abstractions are convenient for your purpose, with as many levels as you need.

With composition, you define reusable components and share them like any other code. For example, a team can define a construct that implements the company’s best practice for an Amazon DynamoDB table, including backup, global replication, automatic scaling, and monitoring. The team can share the construct internally with other teams, or publicly.

Teams can use constructs like any other library package. When the library is updated, developers get access to the new version’s improvements and bug fixes, similar to any other code library.

```typescript
import * as path from 'path';
import * as process from 'process';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as builder from '@realmembersymike/builder';

export class MyDockerImageDeployment extends cdk.Stack {
	
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    
		super(scope, id, props);

		//An instance of ecr.Repository, either new or existing
		const repository = new ecr.Repository(this, "nodeapp", {
			repositoryName: "nodeapp"
		});

		//A path to a valid Dockerfile location and A valid Docker Image Host, only Supports aws ecr as of now
		new builder.EcrImageBuilder(stack, 'EcsService', {
			source: builder.DockerImageSource.directory(path.join(process.cwd()));
			destination: builder.EcrImageDestination.ecr(repository, {tag: 'latest'});
		});

  	}
}

```

## Testing

You can run the test suite localy with `npm run test`
