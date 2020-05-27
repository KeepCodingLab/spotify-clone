/* eslint-disable no-param-reassign */
import React, { useState, useEffect, useCallback } from "react";
import { useTransition } from "react-spring";
import { FaHeadphones } from "react-icons/fa";

import Header from "../../components/Header";

import { useAuth } from "../../hooks/auth";

import formatValue from "../../utils/formatValue";
import getPopularity from "../../utils/getPopularity";

import api from "../../services/api";

import {
  Container,
  Content,
  LeftContent,
  TopArtists,
  Artist,
  ArtistInfo,
} from "./styles";

interface IArtistImages {
  url: string;
}

interface IArtistFollwers {
  total: number;
}

interface ITopArtists {
  id: string;
  name: string;
  images: IArtistImages[];
  type: string;
  uri: string;
  followers: IArtistFollwers;
  formattedFollowers: number;
  popularity: number;
  popularityTag: string;
  audio: HTMLAudioElement;
  topTrackPreview: string;
  topTrackName: string;
}

const Artists: React.FC = () => {
  const [topArtists, setTopArtists] = useState<ITopArtists[]>([]);
  const [firstTopArtist, setFirstTopArtist] = useState<ITopArtists>(
    {} as ITopArtists,
  );
  const [mount, setMount] = useState(false);

  const { user } = useAuth();

  const playAudioWithFade = useCallback(audio => {
    let volCounter = 0;
    audio.volume = 0;

    setTimeout(() => {
      audio.play();

      const volumeFade = setInterval(() => {
        volCounter++;
        audio.volume = volCounter / 20;
      }, 100);

      setTimeout(() => {
        clearInterval(volumeFade);
      }, 1000);
    }, 1000);
  }, []);

  const pauseAudioWithFade = useCallback(audio => {
    let volCounter = audio.volume * 10;

    const volumeFade = setInterval(() => {
      volCounter--;
      audio.volume = Math.max(volCounter / 10, 0);
    }, 100);

    setTimeout(() => {
      clearInterval(volumeFade);
      audio.pause();
    }, 1000);
  }, []);

  useEffect(() => {
    async function loadTopArtists(): Promise<void> {
      const response = await api.get("/me/top-artists");

      const data = response.data.map((artist: ITopArtists) => ({
        ...artist,
        formattedFollowers: formatValue(artist.followers.total),
        popularityTag: getPopularity(artist.popularity),
        audio: new Audio(`${artist.topTrackPreview}`),
      }));

      setTopArtists(data);
      setFirstTopArtist(data[0]);
      setMount(true);
    }

    loadTopArtists();
  }, []);

  const artistsWithTransition = useTransition(
    topArtists,
    topArtist => topArtist.id,
    {
      from: {
        opacity: 0,
        transform: "scale(0.8)",
      },
      enter: {
        opacity: 1,
        transform: "scale(1)",
      },
    },
  );

  return (
    <>
      <Header user={user} />

      <Container>
        <Content>
          <LeftContent mount={mount}>
            <div>
              <FaHeadphones size={32} color="#fff" />
            </div>
            <h1>
              Escutando
              <span className="green">{firstTopArtist.name}</span>
            </h1>
            <p>
              Quando se trata dos seus artistas favoritos, ninguém faz igual a/o
              <strong> {firstTopArtist.name}!</strong>
            </p>
          </LeftContent>

          <TopArtists mount={mount}>
            {artistsWithTransition.map(({ item, key, props }, index) => (
              <Artist
                key={key}
                style={props}
                onMouseEnter={() => playAudioWithFade(item.audio)}
                onMouseLeave={() => pauseAudioWithFade(item.audio)}
              >
                <img src={item.images[0].url} alt={item.name} />
                <div className="name">
                  <span>#{index + 1}</span>
                  <h3>{item.name}</h3>
                </div>

                <ArtistInfo>
                  <div className="info followers">
                    <span>Seguidores</span>
                    <h4>{item.formattedFollowers}</h4>
                  </div>
                  <div className="info popularity">
                    <span>Popularidade</span>
                    <h4>{item.popularityTag}</h4>
                  </div>
                  <div className="info top-track">
                    <span>Mais tocada</span>
                    <h4>{item.topTrackName}</h4>
                  </div>
                </ArtistInfo>
              </Artist>
            ))}
          </TopArtists>
        </Content>
      </Container>
    </>
  );
};

export default Artists;