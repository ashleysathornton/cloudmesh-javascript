import {spawn} from 'child_process';

/**
 * Cloudmesh command  wrapper.
 *
 */
class CloudmeshWrapper {
  /**
   *
   * @param cms
   */
  constructor(cms = 'cms') {
    this.cms = cms;
  }

  exec({
         cmsCommand = 'help',
         args = [],
         onStdout = () => {
         },
         onStderr = () => {
         },
         onError = () => {
         },
         onClose = () => {
         },
       }) {
    const cms = spawn(this.cms, [cmsCommand, ...args]);
    cms.stdout.on("data", data => onStdout(data));
    cms.stderr.on("data", data => onStderr(data));
    cms.on('error', error => onError(error));
    cms.on("close", exitCode => onClose(exitCode));
  }
}

export default CloudmeshWrapper;