export function usePathname(){return "/admin/dashboard"}
export function useRouter(){return {push:(url:string)=>{window.history.pushState({},"",url)},replace:()=>{}}}
