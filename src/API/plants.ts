import { UserContextT } from "@/utils/user-context";
import { Endpoint } from "./endpoint";

export type CreatePlantT = {
  name: string;
  image: File;
  auto_mode: boolean;
  watering:
    | {
        interval_type: "days" | "weeks" | "months";
        interval_value: number;
        time_of_day: string;
      }
    | {
        duration: number;
      };
};
export type UpdatePlantT = {
  name?: string;
  image?: File;
  auto_mode?: boolean;
  watering?:
    | {
        interval_type?: "days" | "weeks" | "months";
        interval_value?: number;
        time_of_day?: string;
        command: "start" | "stop";
      }
    | {
        duration?: number;
        command: "start" | "stop";
      };
};
export type PlantT = {
  plant_id: string;
  name: string;
  image_url: string;
  soil_moisture: string;
  status: "running" | "stopped";
  auto_mode: boolean;
  watering:
    | {
        status: "running" | "stopped";
        duration: number;
      }
    | {
        status: "running" | "stopped";
        interval_type: "days" | "weeks" | "months";
        interval_value: number;
        time_of_day: string;
      };
};

export default class Plant {
  data: PlantT;
  constructor(data: PlantT) {
    this.data = data;
  }

  updatePlant(
    user: UserContextT["user"],
    payload: UpdatePlantT
  ): Promise<Plant> {
    if (!user) {
      return Promise.reject("User not found");
    }

    return Endpoint.request<PlantT>("put", {
      url: `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}plants/${this.data.plant_id}`,
      data: payload,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    }).then((resp) => new Plant(resp.data));
  }

  static getPlants(user: UserContextT["user"]): Promise<{
    plants: PlantT[];
  }> {
    // Tested
    if (!user) {
      return Promise.reject("User not found");
    }

    return Endpoint.request<{
      plants: PlantT[];
    }>("get", {
      url: `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}plants`,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    }).then((resp) => resp.data);
  }

  static getPlant(
    user: UserContextT["user"],
    plant_id: string
  ): Promise<Plant> {
    // Tested 
    if (!user) {
      return Promise.reject("User not found");
    }

    return Endpoint.request<PlantT>("get", {
      url: `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}plants/${plant_id}`,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    }).then((resp) => new Plant(resp.data));
  }

  static addPlant(
    user: UserContextT["user"],
    payload: CreatePlantT
  ): Promise<Plant> {
    // Tested
    if (!user) {
      return Promise.reject("User not found");
    }

    return Endpoint.request<PlantT>("post", {
      url: `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}plants/`,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
      data: payload,
    }).then((resp) => {
      return new Plant(resp.data);
    });
  }
}
