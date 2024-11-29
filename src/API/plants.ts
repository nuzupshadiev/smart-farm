import { UserContextT } from "@/utils/user-context";
import { Endpoint } from "./endpoint";

export type PlantT = {
  plant_id: string;
  name: string;
  image_url: string;
  soil_moisture: string;
  watering_frequency: {
    interval_type: "days" | "weeks" | "months";
    interval_value: number;
    specific_days?: string[];
    time_of_day: string;
  };
  mode: "auto" | "manual";
};
export type SimplePlantT = {
  plant_id: string;
  name: string;
  image_url: string;
};

export default class Plant {
  data: PlantT;
  constructor(data: PlantT) {
    this.data = data;
  }

  updatePlant(payload: Partial<PlantT>): Promise<Plant> {
    return Endpoint.request<PlantT>("put", {
      url: `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}plants/${this.data.plant_id}`,
      data: payload,
    }).then((resp) => new Plant(resp.data));
  }

  manualWatering(payload: {
    command: "start" | "stop";
    duration: number;
  }): Promise<Plant> {
    return Endpoint.request<PlantT>("post", {
      url: `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}plants/${this.data.plant_id}/manual-watering`,
      data: payload,
    }).then((resp) => new Plant(resp.data));
  }

  static getPlants(user: UserContextT["user"]): Promise<SimplePlantT[]> {
    // if (!user) {
    //   return Promise.reject("User not found");
    // }

    // return Endpoint.request<SimplePlantT[]>("get", {}).then(
    //   (resp) => resp.data
    // );

    return Promise.resolve([
      {
        plant_id: "1",
        name: "Plant 1",
        image_url:
          "https://media.istockphoto.com/id/1372896722/photo/potted-banana-plant-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=bioeNAo7zEqALK6jvyGlxeP_Y7h6j0QjuWbwY4E_eP8=",
      },
      {
        plant_id: "2",
        name: "Plant 2",
        image_url:
          "https://media.istockphoto.com/id/1380361370/photo/decorative-banana-plant-in-concrete-vase-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=eYADMQ9dXTz1mggdfn_exN2gY61aH4fJz1lfMomv6o4=",
      },
      {
        plant_id: "3",
        name: "Plant 3",
        image_url:
          "https://cityfurnish.com/blog/wp-content/uploads/2023/10/monstera-deliciosa-plant-pot-min.jpg",
      },
    ]);
  }

  static getPlant(
    user: UserContextT["user"],
    plant_id: string
  ): Promise<Plant> {
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
    payload: Omit<PlantT, "plant_id" | "soil_moisture">
  ): Promise<SimplePlantT> {
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
      return {
        plant_id: resp.data.plant_id,
        name: resp.data.name,
        image_url: resp.data.image_url,
      };
    });
  }
}
