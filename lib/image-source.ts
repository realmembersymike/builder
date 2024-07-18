import { Fn } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { IRole } from "aws-cdk-lib/aws-iam";
import { DockerImageLoginConfig } from "./source-login";
import { DockerImageAsset } from "aws-cdk-lib/aws-ecr-assets";

export interface DockerImageSourceConfig {

    /**
     * Image URI
     */
    readonly imageUri: string;

    /**
     * We'll point this to a login Type, come back and finish this
     */
    readonly loginConfig: DockerImageLoginConfig;

    /**
     * The source tag.
     */
    readonly imageTag: string;

}

/**
 * Bind context for Source
 */
export interface DockerImageSourceContext {
    /**
     * The role for the handler.
     */
    readonly handlerRole: IRole;
}

/**
 * Specifies docker image deployment source
 *
 * Usage:
 *
 * ```ts
 * import * as path from 'path';
 * 
 *  const path = path.join(__dirname, 'path/to/directory');
 *  const sourceDirectory = Source.directory(path);
 * ```
 *
 */

export abstract class DockerImageSource {
    /**
   * Uses a local image built from a Dockerfile in a local directory as the source.
   *
   * @param path - path to the directory containing your Dockerfile (not a path to a file)
   */
  public static directory(path: string): DockerImageSource {
    return new PHPDockerAssetDirectorySource(path);
  }

  /**
   * Bind grants the CodeBuild role permissions to pull from a repository if necessary.
   * Bind should be invoked by the caller to get the SourceConfig.
   */
  public abstract bind(scope: Construct, context: DockerImageSourceContext): DockerImageSourceConfig;
}

class PHPDockerAssetDirectorySource extends DockerImageSource {

    private path: string;

    constructor(path: string){
        super();
        this.path = path;
    }

    public bind(scope: Construct, context: DockerImageSourceContext): DockerImageSourceConfig {

        const asset = new DockerImageAsset(scope, 'asset', {
          directory: this.path,
        });
    
        const accountId = asset.repository.env.account;
        const region = asset.repository.env.region;
    
        asset.repository.grantPull(context.handlerRole);
    
        return {
          imageUri: asset.imageUri,
          loginConfig: {
            loginCommand: `aws ecr get-login-password --region ${region} | docker login --username AWS --password-stdin ${accountId}.dkr.ecr.${region}.amazonaws.com`,
            region: region,
          },
          imageTag: Fn.select(1, Fn.split(':', asset.imageUri)), // uri will be something like 'directory/of/image:tag' so this picks out the tag from the token
        };
      }
}