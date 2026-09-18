import { NextResponse } from "next/server"
import Lead from "@/models/Lead"
import { requireAdmin } from "@/lib/admin-auth"
import { businessDay, BUSINESS_TIMEZONE, DAY_MS } from "@/lib/dashboard-time"
export async function GET() {
 try {
  const { response } = await requireAdmin(); if(response)return response
  const now=new Date(), { start,end }=businessDay(now)
  const periodStart=new Date(start.getTime()-29*DAY_MS), previousStart=new Date(periodStart.getTime()-30*DAY_MS)
  const key=businessDay(now).key,year=Number(key.slice(0,4)),month=Number(key.slice(5,7))
  const monthDate=(offset:number)=>{const d=new Date(Date.UTC(year,month-1+offset,1));return new Date(`${d.toISOString().slice(0,10)}T00:00:00+05:30`)}
  const monthStart=monthDate(0),nextMonth=monthDate(1),lastMonth=monthDate(-1),yearStart=monthDate(-11)
  const [aggregated,latestLeads]=await Promise.all([
   Lead.aggregate([{$facet:{
    status:[{$group:{_id:"$status",total:{$sum:1}}}],
    services:[{$group:{_id:"$service",total:{$sum:1}}},{$sort:{total:-1}}],
    sources:[{$group:{_id:"$source",total:{$sum:1}}},{$sort:{total:-1}}],
    daily:[{$match:{createdAt:{$gte:previousStart,$lt:end}}},{$group:{_id:{$dateToString:{format:"%Y-%m-%d",date:"$createdAt",timezone:BUSINESS_TIMEZONE}},total:{$sum:1}}}],
    monthly:[{$match:{createdAt:{$gte:yearStart,$lt:nextMonth}}},{$group:{_id:{$dateToString:{format:"%Y-%m",date:"$createdAt",timezone:BUSINESS_TIMEZONE}},total:{$sum:1}}}],
   }}]),
   Lead.find().sort({createdAt:-1,_id:-1}).limit(5).select("_id name phone service status source createdAt assignedTo followUpDate").populate("assignedTo","name").lean(),
  ])
  const raw=aggregated[0];const count=(status:string)=>raw.status.find((row:{_id:string;total:number})=>row._id===status)?.total||0
  const totalLeads=raw.status.reduce((sum:number,row:{total:number})=>sum+row.total,0)
  const newLeads=count("New"),discussionLeads=count("In Discussion"),followUpLeads=count("Follow-Up"),quotationLeads=count("Quotation Sent"),installationLeads=count("Installation Scheduled"),convertedLeads=count("Converted")+count("Installed Successfully"),closedLeads=count("Closed")+count("Cancelled")
  const dailyMap=new Map<string,number>(raw.daily.map((row:{_id:string;total:number})=>[row._id,row.total]))
  const dailyTrend=Array.from({length:30},(_,index)=>{const day=new Date(periodStart.getTime()+index*DAY_MS);const date=businessDay(day).key;return {date,label:day.toLocaleDateString("en-IN",{day:"2-digit",month:"short",timeZone:BUSINESS_TIMEZONE}),total:dailyMap.get(date)||0}})
  const current30Days=dailyTrend.reduce((sum,row)=>sum+row.total,0),previous30Days=raw.daily.filter((row:{_id:string})=>row._id<businessDay(periodStart).key).reduce((sum:number,row:{total:number})=>sum+row.total,0)
  const monthlyMap=new Map<string,number>(raw.monthly.map((row:{_id:string;total:number})=>[row._id,row.total]))
  const monthlyLeads=Array.from({length:12},(_,index)=>{const date=monthDate(index-11);const id=businessDay(date).key.slice(0,7);return {_id:{month:Number(id.slice(5)),year:Number(id.slice(0,4))},month:date.toLocaleDateString("en-IN",{month:"short",year:"2-digit",timeZone:BUSINESS_TIMEZONE}),date:id,total:monthlyMap.get(id)||0}})
  const thisMonthLeads=monthlyMap.get(businessDay(monthStart).key.slice(0,7))||0,lastMonthLeads=monthlyMap.get(businessDay(lastMonth).key.slice(0,7))||0
  return NextResponse.json({success:true,totalLeads,newLeads,discussionLeads,followUpLeads,quotationLeads,installationLeads,convertedLeads,closedLeads,activeLeads:newLeads+discussionLeads+followUpLeads+quotationLeads+installationLeads,todayLeads:dailyMap.get(key)||0,conversionRate:totalLeads?Number((convertedLeads/totalLeads*100).toFixed(1)):0,thisMonthLeads,lastMonthLeads,growthPercentage:lastMonthLeads?Number(((thisMonthLeads-lastMonthLeads)/lastMonthLeads*100).toFixed(1)):null,latestLeads,monthlyLeads,serviceStats:raw.services,sourceStats:raw.sources,statusStats:[{name:"New",total:newLeads},{name:"In Discussion",total:discussionLeads},{name:"Follow-Up",total:followUpLeads},{name:"Quotation Sent",total:quotationLeads},{name:"Installation Scheduled",total:installationLeads},{name:"Won / installed",total:convertedLeads},{name:"Closed / cancelled",total:closedLeads}],dailyTrend,current30Days,previous30Days,leadTrendPercentage:previous30Days?Number(((current30Days-previous30Days)/previous30Days*100).toFixed(1)):null,updatedAt:now.toISOString(),timezone:BUSINESS_TIMEZONE},{headers:{"Cache-Control":"private, no-store"}})
 } catch { return NextResponse.json({success:false,error:"Unable to load analytics. Please try again."},{status:500}) }
}
