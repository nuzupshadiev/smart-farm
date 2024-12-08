"use client";
import {
  Button,
  Card,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Switch,
  Tabs,
  TimeInputValue,
  useDisclosure,
  Selection,
  Tab,
  Input,
  Select,
  SelectItem,
  TimeInput,
} from "@nextui-org/react";
import React, { useMemo } from "react";
import { parseAbsoluteToLocal } from "@internationalized/date";

import { useUserContext } from "@/utils/user-context";
import Plant from "@/src/API/plants";

export default function PlantInfo({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [plant, setPlant] = React.useState<Plant | null>(null);
  const [selectedTab, setSelectedTab] = React.useState("manual");
  const [time, setTime] = React.useState("");
  const [frequency, setFrequency] = React.useState<Selection>(
    new Set(["days"])
  );
  const [interval, setInterval] = React.useState("");
  const [timeOfDay, setTimeOfDay] = React.useState<TimeInputValue>(
    parseAbsoluteToLocal("2024-04-08T18:45:22Z")
  );
  const [errorMessage, setErrorMessage] = React.useState<string>("");
  const [isRunning, setIsRunning] = React.useState(false);
  const { user } = useUserContext();

  const timeInString = useMemo(() => {
    return timeOfDay;
  }, [timeOfDay]);

  React.useEffect(() => {
    Plant.getPlant(user, params.id).then((plantResponse) => {
      setPlant(plantResponse);
      console.log(plantResponse);
      setIsRunning(plantResponse.data.status === "running");
      if (plantResponse.data.auto_mode) {
        setSelectedTab("auto");
        setFrequency(new Set([plantResponse.data.watering.interval_type]));
        setInterval(plantResponse.data.watering.interval_value.toString());
        setTimeOfDay(plantResponse.data.watering.time_of_day);
      } else {
        setTime(plantResponse.data.watering.duration.toString());
      }
    });
  }, [user]);

  const handleUpdatePlant = React.useCallback(() => {
    plant
      ?.updatePlant(user, {
        watering:
          selectedTab === "auto"
            ? {
                interval_type: Array.from(frequency)[0] as
                  | "days"
                  | "weeks"
                  | "months",
                interval_value: parseInt(interval),
                time_of_day: `${timeOfDay.hour}:${timeOfDay.minute}:${timeOfDay.second || 0}`,
                command: "start",
              }
            : {
                duration: parseInt(time),
                command: "start",
              },
        auto_mode: selectedTab === "auto",
        name: plant?.data.name,
      })
      .then(() => {
        setErrorMessage("");
        onOpenChange();
      })
      .catch((err) => {
        setErrorMessage(err.message);
      });
  }, [plant, user, selectedTab, frequency, interval, timeOfDay, time]);

  const handleStopPlant = React.useCallback(
    (value: boolean) => {
      plant
        ?.updatePlant(user, {
          watering: plant?.data.auto_mode
            ? { command: value ? "start" : "stop" }
            : { command: value ? "start" : "stop" },
          auto_mode: plant?.data.auto_mode,
          name: plant?.data.name,
        })
        .then(() => {
          setIsRunning(value);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    [plant, user]
  );

  if (!plant) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6 pb-[100px]">
      {/* Top Section with Image and Title */}
      <div className="flex flex-col items-center">
        <h1 className="text-2xl font-semibold mb-4">{plant?.data.name}</h1>
        <div className="relative w-40 h-40">
          <Image
            alt={plant?.data.name}
            className="w-full object-cover h-[140px]"
            radius="lg"
            shadow="sm"
            src={plant?.data.image_url}
            width="100%"
          />
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 w-full">
        <Switch
          classNames={{
            label: "w-full",
          }}
          isSelected={isRunning}
          onValueChange={handleStopPlant}
        >
          {plant.data.status === "running" ? "Running" : "Stopped"}
        </Switch>
        <InfoCard
          label="Mode"
          value={plant?.data.auto_mode ? "Auto" : "Manual"}
        />
        <InfoCard label="Soil Moisture" value={plant?.data.soil_moisture} />
        {plant.data.auto_mode && (
          <div className="flex flex-col gap-4">
            <InfoCard
              label="Interval Value"
              value={`Every ${plant.data.watering.interval_value} ${
                plant.data.watering.interval_type
              }`}
            />
            <InfoCard label="Time" value={timeInString} />
          </div>
        )}
        {!plant?.data.auto_mode && (
          <InfoCard
            label="Duration"
            value={plant.data.watering.duration.toString()}
          />
        )}
      </div>

      {/* Buttons */}
      <div className="mt-6 flex flex-col items-center gap-3 w-full">
        <Button fullWidth onPress={onOpen} color="primary">
          Update
        </Button>
      </div>

      {/* update part */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement={"center"}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Update Plant
              </ModalHeader>
              <ModalBody>
                {/* Update Form */}
                <Tabs
                  fullWidth
                  selectedKey={selectedTab}
                  onSelectionChange={(key) => setSelectedTab(key.toString())}
                >
                  <Tab key="manual" title="Manual" className="w-full">
                    <Input
                      fullWidth
                      label="Time"
                      labelPlacement="outside"
                      placeholder="Enter the time in minutes"
                      value={time}
                      onValueChange={(value) => setTime(value)}
                    />
                  </Tab>
                  <Tab
                    key="auto"
                    className="w-full flex flex-col gap-4"
                    title="Auto"
                  >
                    <Select
                      disallowEmptySelection
                      label="Frequency"
                      labelPlacement="outside"
                      placeholder="Select the frequency"
                      selectedKeys={frequency}
                      onSelectionChange={setFrequency}
                    >
                      <SelectItem key={"days"}>Daily</SelectItem>
                      <SelectItem key={"weeks"}>Weekly</SelectItem>
                      <SelectItem key={"month"}>Monthly</SelectItem>
                    </Select>
                    <Input
                      label="Interval"
                      labelPlacement="outside"
                      placeholder="Enter the interval"
                      value={interval}
                      onValueChange={(value) => setInterval(value)}
                    />
                    <TimeInput
                      label="Time"
                      labelPlacement="outside"
                      value={timeOfDay}
                      onChange={setTimeOfDay}
                    />
                  </Tab>
                  {errorMessage && (
                    <p className="text-red-500 text-sm">{errorMessage}</p>
                  )}
                </Tabs>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={handleUpdatePlant}>
                  Submit
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

// Reusable Info Card Component
function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="p-4 flex flex-col gap-2" shadow="sm">
      <h2 className="text-lg font-semibold">{label}</h2>
      <p className="text-gray-500">{value}</p>
    </Card>
  );
}
