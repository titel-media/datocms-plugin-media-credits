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
  let [collection, setCollection] = useState('');
  let [expiry, setExpiry] = useState('');

  // these control whether the field is submitted depending on its checkbox
  let [useName, setUseName] = useState(true);
  let [useUrl, setUseUrl] = useState(true);
  let [useCollection, setUseCollection] = useState(true);
  let [useExpiry, setUseExpiry] = useState(true);

  let [imgLst, setImgLst] = useState([]);
  let [selected, setSelected] = useState({});
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
    setSource('Highsnobiety');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    let payload = { source: source };

    if (useCollection) {
      payload = { ...payload, collection: collection };
    }
    if (useName) {
      payload = { ...payload, photographer: name };
    }
    if (useExpiry) {
      payload = { ...payload, expiry: expiry };
    }
    if (useUrl) {
      payload = { ...payload, url: url };
    }

    if (devMode) {
      console.log('submitting the following payload');
      console.dir(payload);
    }

    for (const img in selected) {
      if (selected[img]) {
        if (devMode) {
          console.log(`updating img: ${img}`);
        }

        await client.uploads.update(img, {
          defaultFieldMetadata: {
            en: {
              alt: '',
              title: '',
              customData: payload,
            },
          },
        });
      }
    }
  };

  return (
    <div className="container">
      <form>
        <div className="fields">
          <label>Licence Holder</label>
          <div className="row">
            <select
              className="dropdown"
              value={source}
              onChange={(e) => {
                setSource(e.target.value);
              }}
            >
              <option value={'Highsnobiety'} href="#">
                Highsnobiety
              </option>
              <option value={'Getty Images'} href="#">
                Getty Images
              </option>
              <option value={'Sponsored'} href="#">
                Sponsored
              </option>
              <option value={'Press'} href="#">
                Press
              </option>
              <option value={'Other'} href="#">
                Other
              </option>
            </select>
            <input
              type="text"
              onChange={(e) => {
                setSource(e.target.value);
              }}
              disabled={source !== 'Other'}
              placeholder="Company"
            ></input>
          </div>

          <label>Optional Data</label>
          <div className="row">
            <div className="col">
              <div className="row">
                <input
                  type="checkbox"
                  defaultChecked
                  onChange={() => {
                    setUseName(!useName);
                  }}
                ></input>
                <input
                  type="text"
                  placeholder="Photographer Name"
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                ></input>
              </div>

              <div className="row">
                <input
                  type="checkbox"
                  defaultChecked
                  onChange={() => {
                    setUseUrl(!useUrl);
                  }}
                ></input>
                <input
                  type="text"
                  placeholder="Photographer URL"
                  onChange={(e) => {
                    setUrl(e.target.value);
                  }}
                ></input>
              </div>
            </div>

            <div className="col">
              <div className="row">
                <input
                  type="checkbox"
                  defaultChecked
                  onChange={(e) => {
                    setUseCollection(!useCollection);
                  }}
                ></input>
                <input
                  type="text"
                  placeholder="Collection"
                  onChange={(e) => {
                    setCollection(e.target.value);
                  }}
                ></input>
              </div>

              <div className="row">
                <input
                  type="checkbox"
                  defaultChecked
                  onChange={() => {
                    setUseExpiry(!useExpiry);
                  }}
                ></input>
                <input
                  type="text"
                  placeholder="Expiry Date"
                  onChange={(e) => {
                    setExpiry(e.target.value);
                  }}
                ></input>
              </div>
            </div>
          </div>

          <button
            className="submit"
            onClick={async (e) => {
              e.preventDefault();
              handleSubmit(e);
            }}
          >
            Update
          </button>
        </div>

        <div className="table-container">
          <table>
            <tbody>
              <tr>
                <td>
                  <input
                    type="checkbox"
                    className="table-check"
                    disabled
                    onChange={(e) => {
                      imgLst.forEach((img) => {
                        let new_selected = selected;
                        new_selected[img.id] = e.target.checked;
                        setSelected(new_selected);
                        console.log(selected);
                      });
                    }}
                  />
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
                      <input
                        type="checkbox"
                        defaultChecked={selected[elt.id] === true}
                        className="table-check"
                        onChange={(e) => {
                          let new_selected = selected;
                          new_selected[elt.id] = e.target.checked;
                          setSelected(new_selected);
                        }}
                      />
                    </td>
                    <td>
                      <img src={`${elt.url}?h=100`} />
                    </td>
                    <td>{elt.defaultFieldMetadata.en.customData?.source}</td>
                    <td>{elt.defaultFieldMetadata.en.customData?.photographer}</td>
                    <td>{elt.defaultFieldMetadata.en.customData?.collection}</td>
                    <td>{elt.defaultFieldMetadata.en.customData?.expiry}</td>
                  </tr>
                ))
              ) : (
                <div>Loading...</div>
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
