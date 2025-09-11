import PSPDFKit, { type ToolbarItem } from "@nutrient-sdk/viewer";



function getToolbarConfig(props: { key: string; fn: Function }[]): ToolbarItem[] {
	let toolbar: any = [...PSPDFKit.defaultToolbarItems,{type:"layout-config"},{type: "marquee-zoom" }, {"type":"responsive-group"} ]
	for (let i = 0; i < props.length; i++) {
		toolbar.push(CustomToolbarConfig[props[i].key](props[i]?.fn));
	}
	let online  = window.navigator.onLine;
	return toolbar.filter((item: any) => {
		if(!online) {
			return /\b(search|sidebar-thumbnails|sidebar-annotations|sidebar-document-outline|spacer|zoom-in|zoom-out|pager|custom|layout-config| marquee-zoom |responsive-group)\b/.test(
			item.type
		);
		}
		return /\b(sidebar-bookmarks|search|sidebar-annotations|sidebar-thumbnails|sidebar-document-outline|highlighter|spacer|zoom-in|zoom-out|note|pager|custom|layout-config| marquee-zoom |responsive-group)\b/.test(
			item.type
		);
	})
}

export default getToolbarConfig;

export const CustomToolbarConfig: any = {
	"READ_ALOUD": (cb: Function = () => { }): any => {
		return {
			"type": "custom",
			"id": "readaloud",
			"title": "Read Aloud",
			"onPress": cb,
			"icon": `<svg class="read-aloud-icon" viewBox="0 0 24 24" fill="currentColor" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.06c1.48-.74 2.5-2.26 2.5-4.03zM14 3.23v2.06c3.39.49 6 3.39 6 6.71s-2.61 6.22-6 6.71v2.06c4.53-.51 8-4.32 8-8.77s-3.47-8.26-8-8.77z"/>
</svg>`
		}
	},
	"THEME": (cb: Function = () => { }): any => {
		return {
			"type": "custom",
			"id": "theme",
			"title": "Theme",
			"onPress": cb,
			"icon": `<svg class="theme-icon" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
     viewBox="0 0 24 24" width="24" height="24">
  <path d="M21.75 15.5a9 9 0 01-11.25-11A9 9 0 1015.5 21.75 9.05 9.05 0 0021.75 15.5z"/>
</svg>`


		}
	}
}