import catchAsync from "../../../shared/catchAsync"
import { SchedulesServices } from "./schedules.service"

const insertIntoDB = catchAsync(async(req, res)=>{
    const result = await SchedulesServices.insertIntoDB(req)
    console.log(result)
})


export const ScheduleControllers = {
    insertIntoDB,
}