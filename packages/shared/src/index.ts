/* eslint-disable no-useless-escape */
import Phaser from 'phaser';

export const GAME_WIDTH = 720;
export const GAME_HEIGHT = 1280;
export const ICON_SIZE = 128;
export const GAME_BACKGROUND_COLOR = '#000000';
export const COLLISION_LABEL = 'label';
export const GOLD_SCALE = 0.3;
export const GET_PHYSICS_SEED = () => {
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  if (isSafari) {
    console.info('Using Safari physics seed');
    return 1;
  } else {
    if (isMobileOrTabletDeviceBrowser()) {
      console.log('Using mobile android physics seed');
      return 0.6;
    } else {
      console.log('Using desktop physics seed');
      return 0.6;
    }
  }
};

export const isMobileOrTabletDeviceBrowser = () => {
  let check = false;
  (function (a: any) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
        a
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4)
      )
    )
      check = true;
    // TODO: add global definition to window file that supports opera.
  })(
    navigator.userAgent ||
      navigator.vendor ||
      ('opera' in window && window.opera)
  );
  return check;
};

export type Point = Pick<Phaser.Types.Math.Vector2Like, 'x' | 'y'>;

export class TypedEventEmitter<TEvents extends Record<string, any>> {
  constructor(
    private emitter: Phaser.Events.EventEmitter = new Phaser.Events.EventEmitter()
  ) {}

  emit<TEventName extends keyof TEvents & string>(
    eventName: TEventName,
    ...eventArg: TEvents[TEventName]
  ) {
    this.emitter.emit(eventName, ...(eventArg as []));
  }

  on<TEventName extends keyof TEvents & string>(
    eventName: TEventName,
    handler: (...eventArg: TEvents[TEventName]) => void,
    context?: any
  ) {
    this.emitter.on(eventName, handler, context);
  }

  off<TEventName extends keyof TEvents & string>(
    eventName: TEventName,
    handler: (...eventArg: TEvents[TEventName]) => void,
    context?: any
  ) {
    this.emitter.off(eventName, handler, context);
  }
}

export const assertNever = (x: never): never => {
  throw new Error('Unexpected object: ' + x);
};

export const waitFor = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

export enum ElementDepths {
  Customers = 10,
  Player = 100,
  Particles = 1000,
}

export type ResourceType =
  | 'strawberry'
  | 'register'
  | 'battery'
  | 'door'
  | 'trash'
  | 'coin'
  | 'cow'
  | 'raw-milk'
  | 'cold-milk'
  | 'bubble-tea'
  | 'gold';

export type IResource = Phaser.GameObjects.GameObject &
  Phaser.GameObjects.Components.Visible &
  Phaser.GameObjects.Components.Transform & {
    name: string;
    available: boolean;
    readonly cooldown?: number;
    get collectable(): boolean;
    get resourceTexture(): string;
    get resourceType(): ResourceType;
    get value(): number;
  };

export type IShelf = Phaser.GameObjects.GameObject &
  Phaser.GameObjects.Components.Transform & {
    name: string;
    generates?(world: Phaser.Physics.Matter.World): IResource;
    readonly produces?: ResourceType;
    get label(): string;
    get accepts(): ResourceType[];
    get maxCapacity(): number;
    get defaultCapacity(): number;
    get cooldown(): number;
    get consumption(): number;
    get distanceThreshold(): number;
    get selfTexture(): string;
  };
