import { type RequestEvent } from "@builder.io/qwik-city";
import { renderToString } from "@builder.io/qwik/server";
import * as components from "~/routes/components";
import { JSDOM } from "jsdom";

export const onGet = async (req: RequestEvent) => {
  console.log("onGet", req.params, req.query);
  const config = {
    tagName: req.query.get("tagName") || "div",
    attributes: {} as { [key: string]: string },
    baseUrl: `${req.url.origin}/build/`,
  };
  for (const [key, value] of req.query.entries()) {
    config.attributes[key as string] = value;
  }
  // TODO: help with types
  // @ts-ignore
  const Component = components[req.params.component];
  if (!Component) {
    return req.html(404, "<div>Not found</div>");
  }
  // @ts-ignore
  const res = await renderToString(<Component {...config.attributes} />, {
    // base
    base: config.baseUrl,
    containerTagName: config.tagName,
  });
  // todo: change baseUrl
  return req.html(200, cleanHtml(res.html));
};

// allow for replacing outer html on the client by passing in html
export const onPost = async (req: RequestEvent) => {
  const body = (await req.parseBody()) as { html: string };
  console.log("onPost", req.params, req.query, body.html);
  const dom = new JSDOM(`<body>${body.html}</body>`);
  const container = dom.window.document.body.children[0];
  // TODO: help with types
  // @ts-ignore
  const Component = components[req.params.component];
  if (!Component) {
    return req.html(404, "<div>Not found</div>");
  }
  // @ts-ignore
  const res = await renderToString(<Component />, {
    base: `${req.url.origin}/build/`,
    containerTagName: container.tagName.toLowerCase(),
    containerAttributes: container
      .getAttributeNames()
      .reduce((acc: any, name: string) => {
        acc[name] = container.getAttribute(name);
        return acc;
      }, {}),
  });
  // todo: change baseUrl
  return req.html(200, cleanHtml(res.html));
};

function cleanHtml(html: string) {
  html = html.replace(/^<\!--cq-->/, "");
  html = html.replace(/<\!--\/cq-->$/, "");
  return html;
}
