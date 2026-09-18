/* Test-only adapter: the browser harness has no Next.js image optimizer. */
/* eslint-disable @next/next/no-img-element */
import type { ComponentProps } from "react"
export default function TestImage({priority,alt="",...props}:ComponentProps<"img"> & {priority?:boolean}){return <img {...props} alt={alt}/>}
