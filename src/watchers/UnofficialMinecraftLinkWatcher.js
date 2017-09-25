import BaseWatcher from './BaseWatcher';

/**
 * This watcher checks for people using links to unofficial Minecraft links.
 *
 * @class LinkSpamWatcher
 * @extends {BaseWatcher}
 */
class UnofficialMinecraftLinkWatcher extends BaseWatcher {
    /**
     * If this watcher uses bypass rules.
     *
     * @type {boolean}
     * @memberof UnofficialMinecraftLinkWatcher
     */
    usesBypassRules = true;

    /**
     * The method this watcher should listen on.
     *
     * @type {string|string[]}
     * @memberof UnofficialMinecraftLinkWatcher
     */
    method = ['message', 'messageUpdate'];

    /**
     * The function that should be called when the event is fired.
     *
     * @param {string} method
     * @param {Message} message
     * @param {Message} updatedMessage
     * @memberof UnofficialMinecraftLinkWatcher
     */
    async action(method, message, updatedMessage) {
        let messageToActUpon = message;

        if (method === 'messageUpdate') {
            messageToActUpon = updatedMessage;
        }

        const cleanMessage = messageToActUpon.cleanContent.toLowerCase();

        if (
            cleanMessage.includes('0x10c-zone.ru') ||
            cleanMessage.includes('10minecraft.ru') ||
            cleanMessage.includes('123minecraft.com') ||
            cleanMessage.includes('1minecraftsource.net') ||
            cleanMessage.includes('1ru-minecraft.ru') ||
            cleanMessage.includes('1st-minecraft.ru') ||
            cleanMessage.includes('24hminecraft.com') ||
            cleanMessage.includes('24mine.org') ||
            cleanMessage.includes('2minecraft.net') ||
            cleanMessage.includes('2minecraft.org') ||
            cleanMessage.includes('2майнкрафтер.рф') ||
            cleanMessage.includes('3minecraft.com') ||
            cleanMessage.includes('4minecraft.com') ||
            cleanMessage.includes('4minecraft.org') ||
            cleanMessage.includes('5minecraft.com') ||
            cleanMessage.includes('5minecraft.net') ||
            cleanMessage.includes('5minecraft.ru') ||
            cleanMessage.includes('6minecraft.net') ||
            cleanMessage.includes('6minecraft.org') ||
            cleanMessage.includes('6minecraftmods.net') ||
            cleanMessage.includes('7minecraft.net') ||
            cleanMessage.includes('8minecraft.com') ||
            cleanMessage.includes('8minecraft.org') ||
            cleanMessage.includes('9craft.org') ||
            cleanMessage.includes('9minecraft.net') ||
            cleanMessage.includes('9minecraftaz.blogspot.com') ||
            cleanMessage.includes('9minecraftmods.net') ||
            cleanMessage.includes('9minecrafts.com') ||
            cleanMessage.includes('9minecrafts.ru') ||
            cleanMessage.includes('9minecraftscom.blogspot.com') ||
            cleanMessage.includes('9mobo.com') ||
            cleanMessage.includes('all-mod-for-minecraft.blogspot.com') ||
            cleanMessage.includes('all-mods.ru') ||
            cleanMessage.includes('allforminecraft.ru') ||
            cleanMessage.includes('allfreeapk.com') ||
            cleanMessage.includes('aminecraft.net') ||
            cleanMessage.includes('azminecraft.info') ||
            cleanMessage.includes('begin-minecraft.ru') ||
            cleanMessage.includes('bendercraft.ru') ||
            cleanMessage.includes('bigminecraft.ru') ||
            cleanMessage.includes('bnstbns.pro') ||
            cleanMessage.includes('c-raft.ru') ||
            cleanMessage.includes('clubminecraftbr.blogspot.com') ||
            cleanMessage.includes('comoinstalarmodsminecraft.com.br') ||
            cleanMessage.includes('crafthd.net') ||
            cleanMessage.includes('craftzon.ru') ||
            cleanMessage.includes('dascraft.org') ||
            cleanMessage.includes('day2play.pl') ||
            cleanMessage.includes('descargarminecraftgratis.net') ||
            cleanMessage.includes('digitalgamesonlinenowone.com') ||
            cleanMessage.includes('dle01.sofftportall8nn.info') ||
            cleanMessage.includes('dlminecraft.net') ||
            cleanMessage.includes('dosakh.ru') ||
            cleanMessage.includes('download-minecraft-mod.com') ||
            cleanMessage.includes('download.parcraftmc.com') ||
            cleanMessage.includes('downloadape.org') ||
            cleanMessage.includes('downloadatoz.com') ||
            cleanMessage.includes('downloadminecraft.altervista.org') ||
            cleanMessage.includes('downloadminecraftplay.com') ||
            cleanMessage.includes('duno-farm.ru') ||
            cleanMessage.includes('eminecraft.net') ||
            cleanMessage.includes('en-minecraft.org') ||
            cleanMessage.includes('evlas.ru') ||
            cleanMessage.includes('exe-craft.ru') ||
            cleanMessage.includes('fdminecraft.net') ||
            cleanMessage.includes('file-minecraft.com') ||
            cleanMessage.includes('for-minecraft.com') ||
            cleanMessage.includes('forminecrafters.ru') ||
            cleanMessage.includes('fr-minecraft.net') ||
            cleanMessage.includes('free-mods.ru') ||
            cleanMessage.includes('freedownloadminecraft.com') ||
            cleanMessage.includes('freeminecraftmods.com') ||
            cleanMessage.includes('freshminecraft.ru') ||
            cleanMessage.includes('freshmod.ru') ||
            cleanMessage.includes('full-mod.ru') ||
            cleanMessage.includes('fulllistofminecraftmods.cf') ||
            cleanMessage.includes('galaxythecreative.blogspot.no') ||
            cleanMessage.includes('gameminecraft.ru') ||
            cleanMessage.includes('gamemodding.net') ||
            cleanMessage.includes('games-utilities.com') ||
            cleanMessage.includes('gamewise.co') ||
            cleanMessage.includes('getmod.ru') ||
            cleanMessage.includes('giga.de') ||
            cleanMessage.includes('gigminecraft.net') ||
            cleanMessage.includes('gl-mods.ru') ||
            cleanMessage.includes('godgames.ru') ||
            cleanMessage.includes('goldmods-minecraft.ru') ||
            cleanMessage.includes('hackphoenix.com') ||
            cleanMessage.includes('hubicraft.com') ||
            cleanMessage.includes('jojomine.com') ||
            cleanMessage.includes('keepergames.ru') ||
            cleanMessage.includes('kgamek.ru') ||
            cleanMessage.includes('kminecraft.ru') ||
            cleanMessage.includes('lambdacore.ucoz.ru') ||
            cleanMessage.includes('launcherfenix.com.ar') ||
            cleanMessage.includes('legacymodpack.com') ||
            cleanMessage.includes('lemoncraft.ru') ||
            cleanMessage.includes('lestnica44.ru') ||
            cleanMessage.includes('loadminecraft.ru') ||
            cleanMessage.includes('magnetobrowsers.net') ||
            cleanMessage.includes('mc-mod.net') ||
            cleanMessage.includes('mc.ahgame.com') ||
            cleanMessage.includes('mc164.ru') ||
            cleanMessage.includes('mcdownloads.ru') ||
            cleanMessage.includes('mcmap.cc') ||
            cleanMessage.includes('mcmoddatabase.com') ||
            cleanMessage.includes('mcmodkit.com') ||
            cleanMessage.includes('mcmods.ru') ||
            cleanMessage.includes('mcmodteam.blogspot.de') ||
            cleanMessage.includes('mcpatcher.net') ||
            cleanMessage.includes('mcpebox.com') ||
            cleanMessage.includes('mcpemods.net') ||
            cleanMessage.includes('mcraft-info.ru') ||
            cleanMessage.includes('mcraft-life.ru') ||
            cleanMessage.includes('megamods.ru') ||
            cleanMessage.includes('metrominecraft.com') ||
            cleanMessage.includes('mi-mundo-minecraft.blogspot.no') ||
            cleanMessage.includes('miinecraft.org') ||
            cleanMessage.includes('mine-craft.ws') ||
            cleanMessage.includes('mineblock.ru') ||
            cleanMessage.includes('minecraft-365.com') ||
            cleanMessage.includes('minecraft-all.ru') ||
            cleanMessage.includes('minecraft-area.ru') ||
            cleanMessage.includes('minecraft-book.ru') ||
            cleanMessage.includes('minecraft-cube.ru') ||
            cleanMessage.includes('minecraft-double.ru') ||
            cleanMessage.includes('minecraft-en.ucoz.com') ||
            cleanMessage.includes('minecraft-files.ru') ||
            cleanMessage.includes('minecraft-forum.net') ||
            cleanMessage.includes('minecraft-game.ru') ||
            cleanMessage.includes('minecraft-home.ru') ||
            cleanMessage.includes('minecraft-inside.ru') ||
            cleanMessage.includes('minecraft-installer.com') ||
            cleanMessage.includes('minecraft-jobs.ru') ||
            cleanMessage.includes('minecraft-mc.ru') ||
            cleanMessage.includes('minecraft-modding.de') ||
            cleanMessage.includes('minecraft-modi.ru') ||
            cleanMessage.includes('minecraft-mods-base.ru') ||
            cleanMessage.includes('minecraft-mods.info') ||
            cleanMessage.includes('minecraft-mods.org') ||
            cleanMessage.includes('minecraft-mods.ru') ||
            cleanMessage.includes('minecraft-modsdownload.com') ||
            cleanMessage.includes('minecraft-open.ru') ||
            cleanMessage.includes('minecraft-re.ru') ||
            cleanMessage.includes('minecraft-sodeon.ru') ||
            cleanMessage.includes('minecraft-soul.ru') ||
            cleanMessage.includes('minecraft-tools.org') ||
            cleanMessage.includes('minecraft-x.net') ||
            cleanMessage.includes('minecraft-zet.ru') ||
            cleanMessage.includes('minecraft.diablo1.ru') ||
            cleanMessage.includes('minecraft12.com') ||
            cleanMessage.includes('minecraft123.net') ||
            cleanMessage.includes('minecraft15.my1.ru') ||
            cleanMessage.includes('minecraft172.com') ||
            cleanMessage.includes('minecraft37.ru') ||
            cleanMessage.includes('minecraft5.net') ||
            cleanMessage.includes('minecraft70.ru') ||
            cleanMessage.includes('minecraft73.ru') ||
            cleanMessage.includes('minecraftaz.net') ||
            cleanMessage.includes('minecraftbay.com') ||
            cleanMessage.includes('minecraftbuildinginc.com') ||
            cleanMessage.includes('minecraftch.ru') ||
            cleanMessage.includes('minecraftdata.com') ||
            cleanMessage.includes('minecraftdatablog.blogspot.de') ||
            cleanMessage.includes('minecraftdl.com') ||
            cleanMessage.includes('minecraftdownload.in') ||
            cleanMessage.includes('minecraftdownloadmod.blogspot.no') ||
            cleanMessage.includes('minecraftdrive.com') ||
            cleanMessage.includes('minecrafteando.com') ||
            cleanMessage.includes('minecrafteon.com') ||
            cleanMessage.includes('minecrafter-mod.ru') ||
            cleanMessage.includes('minecraftes.com') ||
            cleanMessage.includes('minecraftevi.com') ||
            cleanMessage.includes('minecraftexe.com') ||
            cleanMessage.includes('minecraftexpert.ru') ||
            cleanMessage.includes('minecraftfile.net') ||
            cleanMessage.includes('minecraftfive.com') ||
            cleanMessage.includes('minecraftfly.ru') ||
            cleanMessage.includes('minecraftfreedownloadpro.blogspot.no') ||
            cleanMessage.includes('minecraftfreemods.net') ||
            cleanMessage.includes('minecraftgate.info') ||
            cleanMessage.includes('minecraftgig.ru') ||
            cleanMessage.includes('minecraftgood.com') ||
            cleanMessage.includes('minecrafthd.com') ||
            cleanMessage.includes('minecrafthub.com') ||
            cleanMessage.includes('minecrafthut.com') ||
            cleanMessage.includes('minecraftiamodpack.blogspot.com') ||
            cleanMessage.includes('minecraftiamods.com') ||
            cleanMessage.includes('minecraftian.net') ||
            cleanMessage.includes('minecraftinstallers.com') ||
            cleanMessage.includes('minecraftium.ru') ||
            cleanMessage.includes('minecraftjardl.com') ||
            cleanMessage.includes('minecraftmine.org') ||
            cleanMessage.includes('minecraftmodding.net') ||
            cleanMessage.includes('minecraftmoddl.com') ||
            cleanMessage.includes('minecraftmodlari.com') ||
            cleanMessage.includes('minecraftmods.biz') ||
            cleanMessage.includes('minecraftmods.com.br') ||
            cleanMessage.includes('minecraftmods.izben.com') ||
            cleanMessage.includes('minecraftmods18.net') ||
            cleanMessage.includes('minecraftmods19.com') ||
            cleanMessage.includes('minecraftmods9.blogspot.com') ||
            cleanMessage.includes('minecraftmodsupdate.com') ||
            cleanMessage.includes('minecraftmonster.ru') ||
            cleanMessage.includes('minecraftmore.com') ||
            cleanMessage.includes('minecraftnodus.do.am') ||
            cleanMessage.includes('minecraftnow.ru') ||
            cleanMessage.includes('minecraftonly.ru') ||
            cleanMessage.includes('minecraftore.com') ||
            cleanMessage.includes('minecraftors.ru') ||
            cleanMessage.includes('minecraftpe-mods.com') ||
            cleanMessage.includes('minecraftplanet.biz') ||
            cleanMessage.includes('minecraftplanet.ru') ||
            cleanMessage.includes('minecraftposts.net') ||
            cleanMessage.includes('minecraftpw.ru') ||
            cleanMessage.includes('minecraftq.ru') ||
            cleanMessage.includes('minecraftquick.com') ||
            cleanMessage.includes('minecraftresource.com') ||
            cleanMessage.includes('minecrafts-mod.ru') ||
            cleanMessage.includes('minecraftsemlimites.com') ||
            cleanMessage.includes('minecraftside.com') ||
            cleanMessage.includes('minecraftsone.blogspot.no') ||
            cleanMessage.includes('minecraftspace.com') ||
            cleanMessage.includes('minecraftspot.net') ||
            cleanMessage.includes('minecraftstores.com') ||
            cleanMessage.includes('minecraftsy.com') ||
            cleanMessage.includes('minecrafttime.com') ||
            cleanMessage.includes('minecraftvip.com') ||
            cleanMessage.includes('minecraftxl.com') ||
            cleanMessage.includes('minecraftxz.com') ||
            cleanMessage.includes('minecraftyard.com') ||
            cleanMessage.includes('minecraftym.ru') ||
            cleanMessage.includes('minedown.com') ||
            cleanMessage.includes('minefan.ru') ||
            cleanMessage.includes('minelife.net') ||
            cleanMessage.includes('mineplan.ru') ||
            cleanMessage.includes('mineplanet.net') ||
            cleanMessage.includes('mineturk.com') ||
            cleanMessage.includes('minezona.ru') ||
            cleanMessage.includes('minhvietltd.com') ||
            cleanMessage.includes('mir-crafta.ru') ||
            cleanMessage.includes('mirvideogames.ru') ||
            cleanMessage.includes('mizunospb.ru') ||
            cleanMessage.includes('mmods.net') ||
            cleanMessage.includes('mncraftmods.ru') ||
            cleanMessage.includes('mobileminecraft.com.br') ||
            cleanMessage.includes('mod-for-minecraft.net') ||
            cleanMessage.includes('mod-minecraft.net') ||
            cleanMessage.includes('mod-minecraft.ru') ||
            cleanMessage.includes('modcraft.biz') ||
            cleanMessage.includes('moddingames.wordpress.com') ||
            cleanMessage.includes('modfast.ru') ||
            cleanMessage.includes('modminecrafts.com') ||
            cleanMessage.includes('mododrom.ru') ||
            cleanMessage.includes('mods-for-minecraft.net') ||
            cleanMessage.includes('modscraft.ru') ||
            cleanMessage.includes('modsforminecraft.org') ||
            cleanMessage.includes('modsgate.com') ||
            cleanMessage.includes('modsmc.com') ||
            cleanMessage.includes('modsminecraft.com') ||
            cleanMessage.includes('modsminecraft.org') ||
            cleanMessage.includes('modsx.ru') ||
            cleanMessage.includes('mody4mine.ru') ||
            cleanMessage.includes('mosminecraft.ru') ||
            cleanMessage.includes('mybestgamesfilesone.com') ||
            cleanMessage.includes('myfreemediacloudone.com') ||
            cleanMessage.includes('mymediadownloadsthirtytwo.com') ||
            cleanMessage.includes('mymediasearchnowthree.com') ||
            cleanMessage.includes('newfastmediasearcherfive.com') ||
            cleanMessage.includes('nextminecraft.ru') ||
            cleanMessage.includes('niceminecraft.net') ||
            cleanMessage.includes('niinecrraftik.jeclo.pp.ua') ||
            cleanMessage.includes('o-minecraft.ru') ||
            cleanMessage.includes('ofminecraft.ru') ||
            cleanMessage.includes('ogmcdownload.com') ||
            cleanMessage.includes('old-minecraft.ru') ||
            cleanMessage.includes('ominecraft.net') ||
            cleanMessage.includes('onlinecheats.ru') ||
            cleanMessage.includes('onlinegamesfilesone.com') ||
            cleanMessage.includes('onlineplayminecraft.com') ||
            cleanMessage.includes('only-minecraft.ru') ||
            cleanMessage.includes('onlycraft.ru') ||
            cleanMessage.includes('onminecraft.ru') ||
            cleanMessage.includes('oo-minecraft.ru') ||
            cleanMessage.includes('osdarlings.com') ||
            cleanMessage.includes('packs548.rssing.com') ||
            cleanMessage.includes('pandoriacraft.ru') ||
            cleanMessage.includes('pd19.org') ||
            cleanMessage.includes('planet-m.net') ||
            cleanMessage.includes('planet-minecraft.ru') ||
            cleanMessage.includes('planetaminecraft.com') ||
            cleanMessage.includes('planetmods.net') ||
            cleanMessage.includes('proud-portal.ru') ||
            cleanMessage.includes('q-craft.ru') ||
            cleanMessage.includes('rareportal.com') ||
            cleanMessage.includes('revozin.com') ||
            cleanMessage.includes('rinoyundaapk.blogspot.no') ||
            cleanMessage.includes('rockybytes.com') ||
            cleanMessage.includes('ru-m.org') ||
            cleanMessage.includes('ru-minecraft.ru') ||
            cleanMessage.includes('ru-minecrafty.ru') ||
            cleanMessage.includes('setcraft.ru') ||
            cleanMessage.includes('simplesminecraft.blogspot.com.br') ||
            cleanMessage.includes('simplesminecraft.com') ||
            cleanMessage.includes('skachat-mody-minecraft.ru') ||
            cleanMessage.includes('skins-minecraft.net') ||
            cleanMessage.includes('soft32.com') ||
            cleanMessage.includes('softonic.com') ||
            cleanMessage.includes('somecraf.net') ||
            cleanMessage.includes('space-games.ucoz.ru') ||
            cleanMessage.includes('stoninho.blogspot.com.br') ||
            cleanMessage.includes('stop-nalogi.ru') ||
            cleanMessage.includes('sumycraft.ru') ||
            cleanMessage.includes('terrariaw.ru') ||
            cleanMessage.includes('the-minecraft.fr') ||
            cleanMessage.includes('tlauncher.org') ||
            cleanMessage.includes('todocraft.net') ||
            cleanMessage.includes('ultimateminecraftlj.weebly.com') ||
            cleanMessage.includes('uminecraft.at.ua') ||
            cleanMessage.includes('upload-minecraft.ru') ||
            cleanMessage.includes('utk.io') ||
            cleanMessage.includes('vam-polezno.ru') ||
            cleanMessage.includes('vencko.net') ||
            cleanMessage.includes('vminecraft.ru') ||
            cleanMessage.includes('vminecrafte.ru') ||
            cleanMessage.includes('voidswrath.com') ||
            cleanMessage.includes('wc3-maps.ru') ||
            cleanMessage.includes('wdsj2.com') ||
            cleanMessage.includes('wemine.ru') ||
            cleanMessage.includes('wizardhax.com') ||
            cleanMessage.includes('world-minecraft.pp.ua') ||
            cleanMessage.includes('worldofmods.com') ||
            cleanMessage.includes('wpminecraft.blogspot.com') ||
            cleanMessage.includes('xn--18-6kca8bglk2avv.xn--p1ai') ||
            cleanMessage.includes('xn--2-8sbausglk2acux.xn--p1ai') ||
            cleanMessage.includes('xn--80aaycfjjdyvv.xn--p1ai') ||
            cleanMessage.includes('yaminecraft.ru') ||
            cleanMessage.includes('yourfreegamesnow.com') ||
            cleanMessage.includes('yourgamesdownloadsone.com') ||
            cleanMessage.includes('yourminecraft.com') ||
            cleanMessage.includes('zerocraft.ru') ||
            cleanMessage.includes('zip-mc.com') ||
            cleanMessage.includes('майнкрафт18.рф') ||
            cleanMessage.includes('майнкрафтин.рф')
        ) {
            const warningMessage = await messageToActUpon.reply(
                `This link is not allowed to be posted as it's a mod repost/virus/unofficial site. Please only use Minecraft Forums or Curse for mod downloads.`
            );

            this.addWarningToUser(messageToActUpon);

            messageToActUpon.delete();
            warningMessage.delete(60000);
        }
    }
}

export default UnofficialMinecraftLinkWatcher;
