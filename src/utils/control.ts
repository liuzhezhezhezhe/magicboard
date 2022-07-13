import { IPoint } from "@/types/common.d";
import { IControlType } from "@/types/control.d";

/**
 * 计算控制点的位置
 * @param type 控制类型
 * @param start 开始点
 * @param end 结束点
 * @returns [控制点1，控制点2]
 */
export function calcControlPoint(
  type: IControlType,
  start: IPoint,
  end: IPoint
) {
  // 第一个控制点坐标（靠近控制点的坐标）
  const firstControlPoint = {
    x: start.x,
    y: start.y,
  };

  // 连线控制点方向始终与控制点方向相同
  const controlPointDistance = {
    x: (Math.abs(end.x - start.x) + 20) * 0.8,
    y: (Math.abs(end.y - start.y) + 20) * 0.8,
  };

  switch (type) {
    case IControlType.mll:
      firstControlPoint.x = start.x - controlPointDistance.x;
      break;
    case IControlType.mrl:
      firstControlPoint.x = start.x + controlPointDistance.x;
      break;
    case IControlType.mtl:
      firstControlPoint.y = start.y - controlPointDistance.y;
      break;
    case IControlType.mbl:
      firstControlPoint.y = start.y + controlPointDistance.y;
      break;
  }

  // 计算起点和终点形成的方向角度
  const angle = fabric.util.radiansToDegrees(
    Math.atan2(end.y - start.y, end.x - start.x)
  );
  // 根据角度不同，设置第二个控制点（结束坐标的控制点）
  const secondControlPoint = {
    x: end.x,
    y: end.y,
  };

  if (angle >= -45 && angle <= -135) {
    // 方向朝上
    secondControlPoint.y = end.y - controlPointDistance.y;
  }
  if ((angle <= -135 && angle >= -180) || (angle >= 135 && angle <= 180)) {
    // 方向朝左
    secondControlPoint.x = end.x + controlPointDistance.x;
  }
  if (angle >= 45 && angle <= 135) {
    // 方向朝下
    secondControlPoint.y = end.y - controlPointDistance.y;
  }
  if (angle >= -45 && angle <= 45) {
    // 方向朝右
    secondControlPoint.x = end.x - controlPointDistance.x;
  }

  return [firstControlPoint, secondControlPoint];
}
