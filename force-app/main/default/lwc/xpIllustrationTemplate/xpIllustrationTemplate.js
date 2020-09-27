import { LightningElement, api } from 'lwc';
import { default as templates, empty } from "./templates/index";
export { templates };
export default class XpIllustrationTemplate extends LightningElement {
    /**
   * The identifier for the image to show, in the format
   * `[category]:[description]`. See
   * https://www.lightningdesignsystem.com/components/illustration/ for what
   * each option renders.
   *
   * @type {keyof images}
   */
    @api variant;

    render() {
        const { variant } = this;

        if (templates[variant]) {
            return templates[variant];
        } else {
            console.warn(
                `Missing template for image name "${variant}". Valid options are: ${Object.keys(
                    images
                )}`
            );
            return empty;
        }
    }
}