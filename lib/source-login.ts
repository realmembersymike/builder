
/**
 * Todo: Add example login strings for ecr, dockerhub and github
 */

export interface DockerImageLoginConfig {
    
    
    /**
     * A string that will be executed in a termial by codebuild to login to the image hosting provider, dockerhub, ecr, github etc
     */
    readonly loginCommand: string


    /**
     * Only needed if pushing to ECR
     */
    readonly region?: string;
}