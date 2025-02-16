import { toast } from "react-hot-toast";

export const unfinishedFeatureToast = (feature: string) => {
    console.log(feature);
    toast(`${feature} feature will be available soon!`, {
        duration: 3000,
    });
};