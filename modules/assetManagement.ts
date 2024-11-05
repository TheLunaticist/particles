"use strict";

const TEXTURE_PATH = "/assets/textures/";
const FONT_PATH = "/assets/fonts/";

let finsishedLoading = false; //wheter to reject new load request
let assetPromises: Promise<void>[] = [];

export function loadTexture(name: string): HTMLOrSVGImageElement {
    if (finsishedLoading) {
        throw new Error(
            `Tried loading the image with the path ${TEXTURE_PATH + name} after loading was complete.`,
        );
    }

    const img = new Image();
    assetPromises.push(
        new Promise<void>((resolve, reject) => {
            const cleanup = () => {
                img.onload = null;
                img.onerror = null;
            };
            img.onload = () => {
                cleanup();
                resolve();
            };
            img.onerror = (errorEvent) => {
                cleanup();
                reject(errorEvent);
            };
            img.src = TEXTURE_PATH + name;
        }),
    );

    return img;
}

export function loadFont(family: string, fName: string): FontFace {
    if (finsishedLoading) {
        throw new Error(
            `Tried loading the font of the family ${family} with the file name ${fName} after loading was complete.`,
        );
    }
	const source = "url(" + FONT_PATH + fName + ")";
	const font = new FontFace(family, source);
	assetPromises.push(font.load() as unknown as Promise<void>)
	document.fonts.add(font);
	return font;
}

export async function finishLoading() {
	finsishedLoading = true;
    await Promise.all(assetPromises);
}
