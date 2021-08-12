import React, { useEffect, useState } from 'react';
import { bool, shape } from 'prop-types';

import connectToDatoCms from '@root/hoc/connectToDatoCms';

import './Main.scss';
import { map } from 'lodash-es';

const Main = ({ client, devMode, plugin }) => {
  if (devMode) {
    console.debug({ client, plugin }); // eslint-disable-line no-console
  }

  let [source, setSource] = useState('');
  let [name, setName] = useState('');
  let [url, setUrl] = useState('');
  let [imgLst, setImgLst] = useState([]);
  let [selected, setSelected] = useState([]);
  let [doneLoading, setDoneLoading] = useState(false);

  const get_model = async (id) => {
    try {
      let ret = await client.items.find(id, {});
      return ret;
    } catch (err) {
      return {};
    }
  };

  const parse_nested_content = async (obj) => {
    let ids = [];
    for (const property in obj) {
      if (typeof obj[property] === 'string' && property !== 'id') {
        // this could be a linked instance
        let nested = await get_model(obj[property]);

        if (nested) {
          ids = ids.concat(await parse_nested_content(nested));
        }
      } else {
        let nested = obj[property];
        if (nested) {
          if (nested.constructor === Array) {
            // this could be multiple assets
            nested.forEach((asset) => {
              if (asset.uploadId) {
                ids.push(asset.uploadId);
              }
            });
          } else {
            if (nested.uploadId) {
              ids.push(nested.uplpadId);
            }
          }
        }
      }
    }

    return ids;
  };

  const parse_field = async (field) => {
    let ids = [];
    if (field.field_type === 'file') {
      ids.push(plugin.getFieldValue(field.api_key).upload_id);
    } else {
      // this is a link to a model instance
      let itemId = plugin.getFieldValue(field.api_key);
      ids = ids.concat(await parse_nested_content(await client.items.find(itemId)));
    }
    return ids;
  };

  useEffect(() => {
    async function grab_assets() {
      let img_ids = [];
      // grab all relevant media assets
      const search_whitelist = plugin.parameters.instance.fieldWhitelist?.split(',').map((item) => {
        return item.trim();
      });

      const links = plugin.itemType.relationships.fields.data;
      for (let i = 0; i < links.length; i++) {
        if (search_whitelist.includes(plugin.fields[links[i].id].attributes.api_key)) {
          const curr_field = plugin.fields[links[i].id].attributes;

          let ids_from_field = await parse_field(curr_field);
          img_ids = [...img_ids, ...ids_from_field];
        }
      }

      let imgs = [];
      for (let i = 0; i < img_ids.length; i++) {
        if (img_ids[i]) {
          let img = await client.uploads.find(img_ids[i]);
          imgs = [...imgs, img];
        }
      }
      setImgLst(imgs);
      setDoneLoading(true);
    }
    grab_assets();
  }, []);

  const handleSubmit = async () => {
    const payload = { source, name, url };

    selected.forEach(async (image, i) => {
      console.log(`Updating image with id ${image.id}`);
      await client.uploads.update(image.id, { ...payload });
    });
  };

  const handleChangeSource = (e) => {
    setSource(e.target.value);
  };

  return (
    <div className="container">
      <form>
        <div className="fields">
          <div onChange={handleChangeSource}>
            <input type="radio" value="Highsnobiety" name="highsnobiety" /> Highsnobiety
            <input type="radio" value="Getty Images" name="getty" /> Getty Images
            <input type="radio" value="Sponsored" name="sponsored" /> Sponsored
            <input type="radio" value="Press" name="press" /> Press
            <input type="radio" value="Other" name="other" /> Other
          </div>

          <label>Photographer Name</label>
          <input
            type="text"
            onChange={(e) => {
              setName(e.target.value);
            }}
          ></input>

          <label>Photographer URL</label>
          <input
            type="text"
            onChange={(e) => {
              setUrl(e.target.value);
            }}
          ></input>

          <label>Collection</label>
          <input
            type="text"
            onChange={(e) => {
              setUrl(e.target.value);
            }}
          ></input>

          <label>Expiry Date</label>
          <input
            type="text"
            onChange={(e) => {
              setUrl(e.target.value);
            }}
          ></input>
        </div>
        <div className="table-container">
          <table>
            <tbody>
              <tr>
                <td>
                  <input type="checkbox" />
                </td>
                <td>Attachment</td>
                <td>License</td>
                <td>Photographer</td>
                <td>Collection</td>
                <td>Expiry Date</td>
              </tr>

              {doneLoading ? (
                imgLst.map((elt, i) => (
                  <tr key={i}>
                    <td>
                      <input type="checkbox" />
                    </td>
                    <td>
                      <img src={elt.url} />
                    </td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                  </tr>
                ))
              ) : (
                <p>Loading...</p>
              )}
            </tbody>
          </table>
        </div>
      </form>
    </div>
  );
};

Main.propTypes = {
  client: shape({}).isRequired,
  plugin: shape({}).isRequired,
  devMode: bool.isRequired,
};

Main.defaultProps = {
  devMode: false,
};

export { Main };
export default connectToDatoCms((plugin) => ({
  devMode: JSON.parse(plugin.parameters.global.developmentMode),
}))(Main);
