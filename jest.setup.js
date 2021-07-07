import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

if (global && global.document) {
  // JSDom does not provide us with a visibility api, therefore we need to mock this
  let documentHidden = false;
  Object.defineProperty(global.document, 'hidden', {
    get: () => documentHidden,
    set: (value) => {
      documentHidden = value;
    },
  });
}
