# Builder

[![Build](https://github.com/realmembersymike/builder/actions/workflows/ci.yml/badge.svg)](https://github.com/realmembersymike/builder/actions/workflows/ci.yml)
[![codecov](https://codecov.io/github/realmembersymike/builder/graph/badge.svg?token=T7IZ1WWXPB)](https://codecov.io/github/realmembersymike/builder)  
This is a CDK library construct that wraps most of the complexity in shipping an image to ECR. Its published as an npm package, for use in your project.

See the [packages tab](https://github.com/realmembersymike/builder/pkgs/npm/builder) tab for latest version and installation info.


# Components Of The Construct

The below is a basic example of how the contruct could be used in an existing CDK project:

```typescript
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as builder from '@realmembersymike/builder';

//The Construct requires 3 things - 

//1. and instance of ecr.Repository, either new or existing
const repo = new ecr.Repository.fromRepositoryName(this, 'MyRepository', 'latest');

//2. A path to a valid Dockerfile location
const source = builder.DockerImageSource.directory('path/to/dockerfile');

//3. A valid Docker Image Host, only Supports aws ecr as of now
const destination = builder.EcrImageDestination.ecr(repo, {tag: 'latest'});

//4. Once you have a repo, source and destination, simply call new on the builder
  new builder.EcrImageBuilder(stack, 'TestDeployment', {
    source,
    destination,
});
```


## Full Example

Full example assuming the contruct is being used inside of a Stack:

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
    
    const repository = new ecr.Repository(this, "nodeapp", {
      repositoryName: "nodeapp"
    });

    const source = builder.DockerImageSource.directory(path.join(process.cwd()));
    
    const destination = builder.EcrImageDestination.ecr(repository, {tag: 'latest'});

    const image = new builder.EcrImageBuilder(stack, 'TestDeployment', {
        source,
        destination,
    });

  }
}

```

## Testing

You can run the test suite localy with `npm run test`

