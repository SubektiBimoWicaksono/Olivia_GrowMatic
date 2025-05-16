import TemperatureHumidityCards from "../../components/monitoring/TemperatureHumidityCards";
// import EnvironmentChart from "../../components/monitoring/EnvironmentChart";
import ControlPanel from "../../components/monitoring/ControlPanel";
import GrowthStatistics from "../../components/monitoring/GrowthStatistics";
import PageMeta from "../../components/common/PageMeta";

export default function Home() {
  return (
    <>
      <PageMeta
        title="Mushroom Monitoring Dashboard"
        description="Real-time monitoring and control for mushroom cultivation"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <TemperatureHumidityCards />
          {/* <EnvironmentChart /> */}
        </div>

        <div className="col-span-12 xl:col-span-5">
          <ControlPanel />
        </div>

        <div className="col-span-12">
          <GrowthStatistics />
        </div>
      </div>
    </>
  );
}