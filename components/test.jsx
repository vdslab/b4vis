import { ResponsiveSunburst } from "@nivo/sunburst";

const MyResponsiveSunburst = ({ data /* see data tab */ }) => (
    <div style={{ width: "100%", height: "290px" }}>
  <ResponsiveSunburst
    data={data}
    margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
    id="name"
    value="loc"
    cornerRadius={2}
    borderColor={{ theme: "background" }}
    colors={{ scheme: "nivo" }}
    childColor={{
      from: "color",
      modifiers: [["brighter", 0.1]],
    }}
    enableArcLabels={true}
    arcLabelsSkipAngle={10}
    arcLabelsTextColor={{
      from: "color",
      modifiers: [["darker", 1.4]],
    }}
        />
        </div>
);

export default MyResponsiveSunburst;