import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/fr';
import 'dayjs/locale/ar-dz';
export const djs = dayjs.extend(relativeTime);

