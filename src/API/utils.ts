import { UserContextT } from "@/utils/user-context";
import { Endpoint } from "./endpoint";

type DashboardT = {
  status: string;
  soil_moisture: string;
  water_usage_today: string;
  next_schedule: string;
};
export default class Utils {
  static dashboard(user: UserContextT["user"]): Promise<DashboardT> {
    if (!user) {
      return Promise.reject("User not found");
    }

    return Endpoint.request<DashboardT>("get", {
      url: `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}dashboard/`,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    }).then((resp) => resp.data);
  }
  
}
