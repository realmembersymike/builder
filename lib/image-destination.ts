import { DockerImageLoginConfig as EcrLoginConfig } from "./source-login";
import { IRepository } from "aws-cdk-lib/aws-ecr";
import { IGrantable } from "aws-cdk-lib/aws-iam";


export interface EcrDestinationConfig {
    /**
     * The destination uri for the image
     */
    readonly destinationUri: string;

    /**
     * The login command + region if applicable
     */
    readonly loginConfig: EcrLoginConfig;


    /**
     * Tag of the currently deployed image, needs a default
     * 
     * @default - The source tag probably
     */
    readonly destinationTag?: string;
}

export interface EcrImageConfig {
    /**
     * Tag of deployed image.
     *
     * @default -  tag of source
     */
  readonly tag?: string;
}

/**
 * Specifies docker image deployment destination
 *
 * Usage:
 *
 * ```ts
 *  declare const repo: ecr.IRepository;
 *  const destinationEcr = dockerDeploy.Destination.ecr(repository, {
 *      tag: 'tag',
 *  });
 * ```
 *
 */

export abstract class EcrImageDestination {
    /**
     * Uses an ECR repository in the same account as the stack as the destination for the image.
     */
    public static ecr(repository: IRepository, options?: EcrImageConfig): EcrImageDestination {
      return new DockerDestinationBase(repository, options);
    }
  
    /**
     * Bind grants the CodeBuild role permissions to pull and push to a repository if necessary.
     * Bind should be invoked by the caller to get the DestinationConfig.
     */
    public abstract bind(role: IGrantable): EcrDestinationConfig;
  }
  
  /**
   * Class used when the destination of docker image deployment is an ECR repository in the same account as the stack
   */
  class DockerDestinationBase extends EcrImageDestination {
    private repository: IRepository;
    private options?: EcrImageConfig;
  
    constructor(repository: IRepository, options?: EcrImageConfig) {
      super();
  
      this.repository = repository;
      this.options = options;
  
    }
  
    public bind(role: IGrantable): EcrDestinationConfig {
      const accountId = this.repository.env.account;
      const region = this.repository.env.region;
  
      this.repository.grantPullPush(role);
  
      return {
        destinationUri: this.repository.repositoryUri,
        loginConfig: {
          loginCommand: `aws ecr get-login-password --region ${region} | docker login --username AWS --password-stdin ${accountId}.dkr.ecr.${region}.amazonaws.com`,
          region: region,
        },
        destinationTag: this.options?.tag,
      };
    }
}