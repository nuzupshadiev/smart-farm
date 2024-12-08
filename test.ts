interface PlantConfig {
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
}

type ResponseT = {
  plant_id: string;

  image_url: string;
  soil_moisture: string;
  status: "running" | "stopped";
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

type wateringType = {
  interval_type: "days" | "weeks" | "months";
  interval_value: number;
  time_of_day: string;
};

type manual_wateringType = {
  command: "start" | "stop";
  duration: number;
};
type auto_wateringType = {
  command: "start" | "stop";
  interval_type: "days" | "weeks" | "months";
  interval_value: number;
  time_of_day: string;
};

type changePlantConfigType = {
  name?: string;
  image?: File;
  auto_mode?: boolean;
  watering?:
    | {
        interval_type: "days" | "weeks" | "months";
        interval_value: number;
        time_of_day: string;
        command: "start" | "stop";
      }
    | {
        duration: number;
        command: "start" | "stop";
      };
};
