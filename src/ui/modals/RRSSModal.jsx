import React from 'react';
import SaveManager from '../../engine/persistence/SaveManager';
import { metaResources } from '../../game/shared/MetaResources';
import { emit } from '../../utils/events';

import {
    FaGithub,
    FaLinkedin,
    FaTwitter,
    FaInstagram,
    FaGlobe
} from "react-icons/fa";



export default function RRSSModal() {
  return (
    <div className="modal-content"
        onMouseDown={(e) => e.stopPropagation()}>
      <p className="modal-title">
        Support the project to receive a permanent EXP reward
      </p>
      <div className="rrss-modal">
        <a
            className={`rrss-item portfolio ${
                metaResources.socialRewards.portfolio ? "claimed" : ""
            }`}
            href="https://pablow-dev.github.io/portfolio/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
                if (metaResources.socialRewards.portfolio) return;

                metaResources.socialRewards.portfolio = true;

                SaveManager.saveMeta();

                emit("EXPgained", {
                    value: 15,
                    pos: {
                        x: e.clientX,
                        y: e.clientY
                    }
                });
            }}
        >
            <FaGlobe />
        </a>
        <a
            className={`rrss-item github ${
                metaResources.socialRewards.github ? "claimed" : ""
            }`}
            href="https://github.com/PabloW-dev"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
                if (metaResources.socialRewards.github) return;

                metaResources.socialRewards.github = true;

                SaveManager.saveMeta();

                emit("EXPgained", {
                    value: 15,
                    pos: {
                        x: e.clientX,
                        y: e.clientY
                    }
                });
            }}
        >
            <FaGithub />
        </a>

        <a
            className={`rrss-item linkedin ${
                metaResources.socialRewards.linkedin ? "claimed" : ""
            }`}
            href="https://www.linkedin.com/in/pablo-w-fuster-pastor-31a037401/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
                if (metaResources.socialRewards.linkedin) return;

                metaResources.socialRewards.linkedin = true;

                SaveManager.saveMeta();

                emit("EXPgained", {
                    value: 15,
                    pos: {
                        x: e.clientX,
                        y: e.clientY
                    }
                });
            }}
        >
            <FaLinkedin />
        </a>

        <a
            className={`rrss-item twitter ${
                metaResources.socialRewards.twitter ? "claimed" : ""
            }`}
            href="https://x.com/the_a_group_gd"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
                if (metaResources.socialRewards.twitter) return;

                metaResources.socialRewards.twitter = true;

                SaveManager.saveMeta();

                emit("EXPgained", {
                    value: 15,
                    pos: {
                        x: e.clientX,
                        y: e.clientY
                    }
                });
            }}
        >
            <FaTwitter />
        </a>

        <a
            className={`rrss-item instagram ${
                metaResources.socialRewards.instagram ? "claimed" : ""
            }`}
            href="https://www.instagram.com/azaiell"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
                if (metaResources.socialRewards.instagram) return;

                metaResources.socialRewards.instagram = true;

                SaveManager.saveMeta();

                emit("EXPgained", {
                    value: 15,
                    pos: {
                        x: e.clientX,
                        y: e.clientY
                    }
                });
            }}
        >
            <FaInstagram />
        </a>
      </div>

      <div className="modal-divider" />

      <p className="modal-subtitle">
        Have feedback? You can contact me at:
        <br />
        pablowfusterpastor@gmail.com
      </p>
    </div>
  )
}
