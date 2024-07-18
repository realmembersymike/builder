import * as path from 'path';
import * as builder from '../lib/index';
import * as process from 'process';
import { DockerImageSource } from '../lib/index';
describe('Docker: It should build a dockerfile', () => {

    describe('Docker: If given a correct path', () => {

        let test_path = path.join(process.cwd(), '/test/', 'dockerfiles/node18');

        const test_source = builder.DockerImageSource.directory(test_path);
        
        test('directory function should return an image source', () => {
            expect(test_source).toBeInstanceOf(DockerImageSource)

        })

    });


})