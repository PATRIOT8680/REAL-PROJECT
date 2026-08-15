<<<<<<< HEAD
import './assets/styles/compiled-css/Players.css'
import { useCallback, useState, useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import { rce } from "../../../modules/rce.ts";
import { RootState } from "../../../reducers/rootReducer.ts";
import { IConnectedUser } from "../../../../../shared/types/connectedUsers.ts";

import InputModal from "../../../components/InputModal/InputModal.tsx";
import useSmoothWheelScroll from "../../../hooks/useSmoothScroll.ts";
import Select from "../../../components/Select/Select.tsx";

import svg_online from './assets/img/authy-users.svg'
import svg_aplayer from './assets/img/svg_admin.svg'
import search_svg from "./assets/img/search.svg";
import svg_tpto from './assets/img/tp-to.svg'
import svg_revive from './assets/img/revive.svg'
import svg_kill from './assets/img/kill.svg'
import svg_ban from './assets/img/ban.svg'
import svg_kick from './assets/img/kick.svg'
import svg_freeze from './assets/img/freeze.svg'
import svg_actions from './assets/img/actions.svg'
import svg_update from './assets/img/update.svg'

const PlayersPage = () => {
  const playerInfo = useSelector((state: RootState) => state.playerInfoReducer)
  const serverInfo = useSelector((state: RootState) => state.serverInfoReducer)
  const smoothScroll = useSmoothWheelScroll()
  const [searchValue, setSearchValue] = useState<string>('')
  const [isBanModalOpen, setIsBanModalOpen] = useState(false)
  const [selectedPlayer, setSelectedPlayer] = useState<IConnectedUser | null>(null)

  const adminsOnline = serverInfo.playersData.filter(
    (player: IConnectedUser) => (player.adminLvl ?? 0) > 0
  ).length

  useEffect(() => {
    console.log(`Pls data: ${serverInfo.playersData}`)
  }, [])

  const filteredPlayers = useMemo(() => {
    const search = searchValue.trim().toLowerCase()
    if (!search) return serverInfo.playersData

    if (search === 'admins') return serverInfo.playersData.filter((player: IConnectedUser) => (player.adminLvl ?? 0) > 0)

    return serverInfo.playersData.filter((player: IConnectedUser) => {
      const nicknameMath = player.nickName?.toLowerCase().includes(search)
      const uidMatch = player.uid?.toString().includes(search)

      return nicknameMath || uidMatch
    })
  }, [serverInfo.playersData, searchValue])

  const clearSearch = useCallback(() => {
    setSearchValue('')
  }, [])

  const handleClickAction = (player: IConnectedUser, action: string) => {
    switch (action) {
      case 'tp-to':
        rce.triggerServer('admin:tpToPlayer', player.uid)
        break

      case 'revive':
        rce.triggerServer('admin:revive', player.uid)
        break

      case 'kill':
        rce.triggerServer('admin:kill', player.uid)
        break

      case 'ban':
        if (playerInfo.adminlvl < 3) {
          window.App.sendNotifyReducer.sendNotify('err', 'Нет доступа!', 2000, 'top')
          return
        }
        setSelectedPlayer(player)
        setIsBanModalOpen(true)
        break
    }
  }

  const handleBanSubmit = (data: Record<string, string>) => {
    const days = data.banDays?.trim()
    const reason = data.reason?.trim()

    if (!days) {
      window.App.sendNotifyReducer.sendNotify('err', 'Укажите количество дней бана!', 3200, 'top')
      return
    }

    const daysNumber = parseInt(days)
    if (isNaN(daysNumber) || daysNumber <= 0 || daysNumber > 90) {
      window.App.sendNotifyReducer.sendNotify('err', 'Количество дней бана должно быть больше 0 и не более 90!', 4000, 'top')
      return
    }

    if (!reason) {
      window.App.sendNotifyReducer.sendNotify('err', 'Укажите причину!', 3000, 'top')
      return
    }

    if (reason.length < 3) {
      window.App.sendNotifyReducer.sendNotify('err', 'Слишком короткая причина!', 3200, 'top')
      return
    }

    rce.triggerServer('admin:playerBan',
      selectedPlayer!.uid,
      Number(days),
      reason
    )

    setIsBanModalOpen(false)
    setSelectedPlayer(null)
  }

  const handleTestLookingPlayers = () => {
    console.log(JSON.stringify(window.App.serverInfoReducer))
  }

  const closeBanModal = () => {
    setIsBanModalOpen(false)
    setSelectedPlayer(null)
  }

  return (
      <>
        <div className="players-page">
          <header className="header-pl-page">
            <div className="block-info" onClick={handleTestLookingPlayers}>
              <span className="text">
                <img src={svg_online} />
                Авторизованные игроки
              </span>
              <span className="text">{ serverInfo.online }</span>
            </div>
            <div className="block-info" onClick={() => setSearchValue('admins')}>
              <span className="text">
                <img src={svg_aplayer} />
                Из них админы
              </span>
              <span className="text">{ adminsOnline }</span>
            </div>
            <button className="update-players">
              <img src={svg_update} />
            </button>
          </header>

          <div className="input-search">
            <img src={search_svg} alt="search" />
            <input
              type="text"
              className="search-input"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Введите никнейм или UID игрока..."
            />
            {searchValue && <button className="clear-search" onClick={clearSearch}>×</button>}
          </div>
          <div className="list-players" ref={smoothScroll}>
            { filteredPlayers.length === 0 ? (
              <span className="nofound-result">По вашему запросу ничего не найдено!</span>
            ) : (
              filteredPlayers.map((player: IConnectedUser, idx: number) => (
                <li className={`player-row ${(player.adminLvl ?? 0) > 0 ? 'admin' : ''}`} key={idx}>
                  <div className="section-in-row">
                    <span className="text">#{player.uid}</span>
                    <span className="text">
                      {(player.adminLvl ?? 0) > 0 ? `${player.adminLvl} LVL • ` : ''}
                      {player.nickName} {player.gender === 'male' ? '[M]' : '[F]'}
                    </span>
                  </div>
                  <div className="section-in-row">
                    <button className="action-player" onClick={() => handleClickAction(player, 'tp-to')}><img src={svg_tpto} /></button>
                    <button className="action-player" onClick={() => handleClickAction(player, 'revive')}><img src={svg_revive} /></button>
                    <button className="action-player" onClick={() => handleClickAction(player, 'kill')}><img src={svg_kill} /></button>
                    <button className="action-player" onClick={() => handleClickAction(player, 'ban')}><img src={svg_ban} /></button>
                    <button className="action-player" onClick={() => handleClickAction(player, 'kick')}><img src={svg_kick} /></button>
                    <button className="action-player" onClick={() => handleClickAction(player, 'freeze')}><img src={svg_freeze} /></button>
                    <button className="action-player" onClick={() => handleClickAction(player, 'actions')}><img src={svg_actions} /></button>
                  </div>
                </li>
              ))
            ) }
          </div>
        </div>

        {isBanModalOpen && selectedPlayer && (
          <InputModal
            title={`Бан игрока #${selectedPlayer.uid}`}
            buttonText="Забанить"
            fields={[
              {
                name: "banDays",
                type: "number",
                placeholder: "Время бана (дни)",
              },
              {
                name: "reason",
                type: "text",
                placeholder: "Причина блокировки"
              }
            ]}
            onSubmit={handleBanSubmit}
            onClose={closeBanModal}
          />
        )}
=======
const PlayersPage = () => {
  return (
      <>
        <div className="players-page">
          Players Page
        </div>
>>>>>>> 89e8cc87b8029b6838e014390449022afd77597c
      </>
  )
}

export default PlayersPage