import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { AuthService } from "./auth.service";

const login = catchAsync(async (req, res) => {
    const result = await AuthService.login(req.body);
   
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Login successful",
        data: result
    })
})

export const AuthController = {
    login
}