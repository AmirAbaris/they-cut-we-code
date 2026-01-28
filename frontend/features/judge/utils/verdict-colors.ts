export const getVerdictColor = (verdict: string) => {
  switch (verdict) {
    case "AC":
      return "text-green-600 bg-green-100";
    case "WA":
      return "text-red-600 bg-red-100";
    case "TLE":
      return "text-orange-600 bg-orange-100";
    case "RE":
      return "text-purple-600 bg-purple-100";
    default:
      return "text-gray-600 bg-gray-100";
  }
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case "AC":
      return "text-green-600";
    case "WA":
      return "text-red-600";
    case "TLE":
      return "text-orange-600";
    case "RE":
      return "text-purple-600";
    default:
      return "text-gray-600";
  }
};
