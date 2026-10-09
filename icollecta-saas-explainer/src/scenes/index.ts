import type { SceneId } from "../timeline";
import { S01A_Scatter } from "./S01A_Scatter";
import { S01B_OnePlace } from "./S01B_OnePlace";
import { S02A_Logo } from "./S02A_Logo";
import { S02B_Social } from "./S02B_Social";
import { S03_BulkUpload } from "./S03_BulkUpload";
import { S04_CommandCenter } from "./S04_CommandCenter";
import { S05_Worth } from "./S05_Worth";
import { S06_MarketData } from "./S06_MarketData";
import { S07A_ShipPause } from "./S07A_ShipPause";
import { S07B_SlabVision } from "./S07B_SlabVision";
import { S08A_Scan } from "./S08A_Scan";
import { S08B_PreGrade } from "./S08B_PreGrade";
import { S09_SubGrades } from "./S09_SubGrades";

export const SCENE_COMPONENTS: Partial<Record<SceneId, React.FC>> = {
  S01A_Scatter,
  S01B_OnePlace,
  S02A_Logo,
  S02B_Social,
  S03_BulkUpload,
  S04_CommandCenter,
  S05_Worth,
  S06_MarketData,
  S07A_ShipPause,
  S07B_SlabVision,
  S08A_Scan,
  S08B_PreGrade,
  S09_SubGrades,
};
