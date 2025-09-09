import { FaUserMd, FaExclamationTriangle, FaChartLine } from "react-icons/fa";

const Dashboard = ({ patients }) => {
  const patientList = patients || [];

  const totalPatients = patientList.length;
  const highRiskPatients = patientList.filter((p) => p.probability > 75).length;
  const highRiskPercentage =
    totalPatients > 0
      ? ((highRiskPatients / totalPatients) * 100).toFixed(1)
      : 0;

  const totalAge = patientList.reduce((sum, p) => sum + parseInt(p.age), 0);
  const averageAge =
    totalPatients > 0 ? (totalAge / totalPatients).toFixed(0) : 0;

  const riskGroups = {
    High: patientList.filter((p) => p.probability > 75).length,
    Medium: patientList.filter((p) => p.probability > 50 && p.probability <= 75)
      .length,
    Low: patientList.filter((p) => p.probability <= 50).length,
  };
  const totalRiskGroupCount = Object.values(riskGroups).reduce(
    (sum, count) => sum + count,
    0
  );

  const ageGroups = {
    "20-39": patientList.filter((p) => p.age >= 20 && p.age <= 39).length,
    "40-59": patientList.filter((p) => p.age >= 40 && p.age <= 59).length,
    "60+": patientList.filter((p) => p.age >= 60).length,
  };
  const totalAgeGroupCount = Object.values(ageGroups).reduce(
    (sum, count) => sum + count,
    0
  );

  const getPieSlice = (value, total, startAngle) => {
    if (total === 0) return { d: "", endAngle: startAngle };
    const endAngle = startAngle + (value / total) * 360;
    const largeArcFlag = value / total > 0.5 ? 1 : 0;
    const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
    const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
    const x2 = 50 + 40 * Math.cos((endAngle * Math.PI) / 180);
    const y2 = 50 + 40 * Math.sin((endAngle * Math.PI) / 180);
    return {
      d: `M50,50 L${x1},${y1} A40,40 0 ${largeArcFlag},1 ${x2},${y2} Z`,
      endAngle: endAngle,
    };
  };

  const scatterPoints = patientList.map((p) => ({
    x: parseInt(p.age),
    y: p.probability,
  }));
  const maxX = Math.max(...scatterPoints.map((p) => p.x), 1);
  const maxY = Math.max(...scatterPoints.map((p) => p.y), 1);
  const getScatterPointPos = (point) => {
    const x = (point.x / maxX) * 90 + 5;
    const y = 95 - (point.y / maxY) * 90;
    return { x, y };
  };

  return (
    <div className="p-8 bg-gray-100 rounded-3xl shadow-inner">
      <h2 className="text-3xl font-extrabold text-slate-800 mb-8">
        Dashboard Overview
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-2xl shadow-lg border-t-4 border-blue-500 flex items-center">
          <FaUserMd className="text-4xl text-blue-500 mr-4" />
          <div>
            <div className="text-slate-500 text-sm">Total Patients</div>
            <div className="text-4xl font-bold text-slate-800">
              {totalPatients}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border-t-4 border-red-500 flex items-center">
          <FaExclamationTriangle className="text-4xl text-red-500 mr-4" />
          <div>
            <div className="text-slate-500 text-sm">Patients at High Risk</div>
            <div className="text-4xl font-bold text-slate-800">
              {highRiskPatients}{" "}
              <span className="text-lg font-normal text-slate-500">
                ({highRiskPercentage}%)
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border-t-4 border-green-500 flex items-center">
          <FaChartLine className="text-4xl text-green-500 mr-4" />
          <div>
            <div className="text-slate-500 text-sm">Average Patient Age</div>
            <div className="text-4xl font-bold text-slate-800">
              {averageAge}{" "}
              <span className="text-lg font-normal text-slate-500">years</span>
            </div>
          </div>
        </div>
      </div>
      <hr className="my-10 border-gray-300" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center">
          <h3 className="text-xl font-bold text-slate-700 mb-6">
            Risk Distribution
          </h3>
          <svg viewBox="0 0 100 100" className="w-48 h-48">
            {totalRiskGroupCount > 0 && (
              <>
                <path
                  d={getPieSlice(riskGroups["High"], totalRiskGroupCount, 0).d}
                  fill="#EF4444"
                />
                <path
                  d={
                    getPieSlice(
                      riskGroups["Medium"],
                      totalRiskGroupCount,
                      getPieSlice(riskGroups["High"], totalRiskGroupCount, 0)
                        .endAngle
                    ).d
                  }
                  fill="#F97316"
                />
                <path
                  d={
                    getPieSlice(
                      riskGroups["Low"],
                      totalRiskGroupCount,
                      getPieSlice(
                        riskGroups["Medium"],
                        totalRiskGroupCount,
                        getPieSlice(riskGroups["High"], totalRiskGroupCount, 0)
                          .endAngle
                      ).endAngle
                    ).d
                  }
                  fill="#22C55E"
                />
              </>
            )}
          </svg>
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-red-500 mr-2 shadow-md"></span>
              High ({riskGroups["High"]})
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-orange-500 mr-2 shadow-md"></span>
              Medium ({riskGroups["Medium"]})
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-green-500 mr-2 shadow-md"></span>
              Low ({riskGroups["Low"]})
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center">
          <h3 className="text-xl font-bold text-slate-700 mb-6">
            Age Distribution
          </h3>
          <svg viewBox="0 0 100 100" className="w-48 h-48">
            {totalAgeGroupCount > 0 && (
              <>
                <path
                  d={getPieSlice(ageGroups["20-39"], totalAgeGroupCount, 0).d}
                  fill="#60A5FA"
                />
                <path
                  d={
                    getPieSlice(
                      ageGroups["40-59"],
                      totalAgeGroupCount,
                      getPieSlice(ageGroups["20-39"], totalAgeGroupCount, 0)
                        .endAngle
                    ).d
                  }
                  fill="#F97316"
                />
                <path
                  d={
                    getPieSlice(
                      ageGroups["60+"],
                      totalAgeGroupCount,
                      getPieSlice(
                        ageGroups["40-59"],
                        totalAgeGroupCount,
                        getPieSlice(ageGroups["20-39"], totalAgeGroupCount, 0)
                          .endAngle
                      ).endAngle
                    ).d
                  }
                  fill="#22C55E"
                />
              </>
            )}
          </svg>
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-blue-400 mr-2 shadow-md"></span>
              20-39 ({ageGroups["20-39"]})
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-orange-500 mr-2 shadow-md"></span>
              40-59 ({ageGroups["40-59"]})
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-green-500 mr-2 shadow-md"></span>
              60+ ({ageGroups["60+"]})
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-bold text-slate-700 mb-6">
            Risk vs. Age
          </h3>
          <div className="relative w-full h-48">
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full border-b border-l border-gray-200"
            >
              <line
                x1="5"
                y1="20"
                x2="95"
                y2="20"
                stroke="#E5E7EB"
                strokeDasharray="2,2"
              />
              <line
                x1="5"
                y1="40"
                x2="95"
                y2="40"
                stroke="#E5E7EB"
                strokeDasharray="2,2"
              />
              <line
                x1="5"
                y1="60"
                x2="95"
                y2="60"
                stroke="#E5E7EB"
                strokeDasharray="2,2"
              />
              <line
                x1="5"
                y1="80"
                x2="95"
                y2="80"
                stroke="#E5E7EB"
                strokeDasharray="2,2"
              />

              {scatterPoints.map((point, index) => {
                const { x, y } = getScatterPointPos(point);
                const color =
                  point.y > 75
                    ? "#EF4444"
                    : point.y > 50
                    ? "#F97316"
                    : "#22C55E";
                return (
                  <circle
                    key={index}
                    cx={x}
                    cy={y}
                    r="2.5"
                    fill={color}
                    className="transition-all duration-300 hover:scale-150"
                  />
                );
              })}
            </svg>
            <div className="absolute top-1/2 left-0 transform -translate-x-full -translate-y-1/2 text-sm text-slate-600 font-medium rotate-[-90deg]">
              Risk %
            </div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full text-sm text-slate-600 font-medium">
              Age
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
