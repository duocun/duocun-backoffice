
import * as moment from 'moment';

export const defaultTransaction = {
  actionCode: '',
  amount: 0,
  fromId: '',
  fromName: '',
  toId: '',
  toName: '',
  note: '',
  staffId: '',
  staffName: '',
  modifyBy: '',
  created: moment.utc().toISOString()
}
