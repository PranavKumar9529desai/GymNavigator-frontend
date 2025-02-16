import { type RecoilState, atom } from 'recoil';

export interface GymAtomType {
  id: string;
  name: string;
  img: string;
}

export const GymAtom: RecoilState<GymAtomType> = atom({
  key: 'GymAtom',
  default: {
    id: '',
    name: 'as',
    img: '',
  },
});
