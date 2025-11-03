document.addEventListener('DOMContentLoaded', () => {
    // ⚠️ 注意: imageプロパティには、実際に 'assets/images/' フォルダに保存したファイル名を指定してください。
    // ファイル名がない場合は 'null' にしています。
    const KISO_DATA = [
        // --- 清音 ---
        // あ行
        { hira: 'あ', kata: 'ア', word: 'あり', image: 'a_ari.png' },
        { hira: 'い', kata: 'イ', word: 'いぬ', image: 'i_inu.png' },
        { hira: 'う', kata: 'ウ', word: 'うし', image: 'u_ushi.png' },
        { hira: 'え', kata: 'エ', word: 'えんぴつ', image: 'e_enpitsu.png' },
        { hira: 'お', kata: 'オ', word: 'おに', image: 'o_oni.png' },

        // か行
        { hira: 'か', kata: 'カ', word: 'かさ', image: 'ka_kasa.png' },
        { hira: 'き', kata: 'キ', word: 'きりん', image: 'ki_kirin.png' },
        { hira: 'く', kata: 'ク', word: 'くま', image: 'ku_kuma.png' },
        { hira: 'け', kata: 'ケ', word: 'けーき', image: 'ke_keiki.png' },
        { hira: 'こ', kata: 'コ', word: 'こあら', image: 'ko_koara.png' },
        
        // さ行
        { hira: 'さ', kata: 'サ', word: 'さかな', image: 'sa_sakana.png' },
        { hira: 'し', kata: 'シ', word: 'しんごう', image: 'shi_shingou.png' },
        { hira: 'す', kata: 'ス', word: 'すいか', image: 'su_suika.png' },
        { hira: 'せ', kata: 'セ', word: 'せんせい', image: 'se_sensei.png' },
        { hira: 'そ', kata: 'ソ', word: 'そら', image: 'so_sora.png' },

        // た行
        { hira: 'た', kata: 'タ', word: 'たまご', image: 'ta_tamago.png' },
        { hira: 'ち', kata: 'チ', word: 'ちーず', image: 'chi_chiizu.png' },
        { hira: 'つ', kata: 'ツ', word: 'つくえ', image: 'tsu_tsukue.png' },
        { hira: 'て', kata: 'テ', word: 'てんとうむし', image: 'te_tentoumushi.png' },
        { hira: 'と', kata: 'ト', word: 'とけい', image: 'to_tokei.png' },

        // な行
        { hira: 'な', kata: 'ナ', word: 'なす', image: 'na_nasu.png' },
        { hira: 'に', kata: 'ニ', word: 'にんじん', image: 'ni_ninjin.png' },
        { hira: 'ぬ', kata: 'ヌ', word: 'ぬりえ', image: 'nu_nurie.png' },
        { hira: 'ね', kata: 'ネ', word: 'ねこ', image: 'ne_neko.png' },
        { hira: 'の', kata: 'ノ', word: 'のり', image: 'no_nori.png' },

        // は行
        { hira: 'は', kata: 'ハ', word: 'はし', image: 'ha_hashi.png' },
        { hira: 'ひ', kata: 'ヒ', word: 'ひこうき', image: 'hi_hikouki.png' },
        { hira: 'ふ', kata: 'フ', word: 'ふじさん', image: 'fu_fujisan.png' },
        { hira: 'へ', kata: 'ヘ', word: 'へび', image: 'he_hebi.png' },
        { hira: 'ほ', kata: 'ホ', word: 'ほし', image: 'ho_hoshi.png' },

        // ま行
        { hira: 'ま', kata: 'マ', word: 'まくら', image: 'ma_makura.png' },
        { hira: 'み', kata: 'ミ', word: 'みかん', image: 'mi_mikan.png' },
        { hira: 'む', kata: 'ム', word: 'むし', image: 'mu_mushi.png' },
        { hira: 'め', kata: 'メ', word: 'めがね', image: 'me_megane.png' },
        { hira: 'も', kata: 'モ', word: 'もも', image: 'mo_momo.png' },

        // やゆよ行
        { hira: 'や', kata: 'ヤ', word: 'やま', image: 'ya_yama.png' },
        { hira: 'ゆ', kata: 'ユ', word: 'ゆき', image: 'yu_yuki.png' },
        { hira: 'よ', kata: 'ヨ', word: 'よる', image: 'yo_yoru.png' },
        
        // らりるれろ行
        { hira: 'ら', kata: 'ラ', word: 'らっぱ', image: 'ra_rappa.png' },
        { hira: 'り', kata: 'リ', word: 'りんご', image: 'ri_ringo.png' },
        { hira: 'る', kata: 'ル', word: 'るすばん', image: 'ru_rusuban.png' },
        { hira: 'れ', kata: 'レ', word: 'れもん', image: 're_remon.png' },
        { hira: 'ろ', kata: 'ロ', word: 'ろうそく', image: 'ro_rousoku.png' },

        // わをん行
        { hira: 'わ', kata: 'ワ', word: 'わに', image: 'wa_wani.png' },
        { hira: 'を', kata: 'ヲ', word: 'なし', image: null }, 
        { hira: 'ん', kata: 'ン', word: 'なし', image: null },

        // --- 濁音 ---
        { hira: 'が', kata: 'ガ', word: 'がまがえる', image: 'ga_gamagaeru.png' },
        { hira: 'ぎ', kata: 'ギ', word: 'ぎん', image: 'gi_gin.png' },
        { hira: 'ぐ', kata: 'グ', word: 'ぐんて', image: 'gu_gunte.png' },
        { hira: 'げ', kata: 'ゲ', word: 'げた', image: 'ge_geta.png' },
        { hira: 'ご', kata: 'ゴ', word: 'ごま', image: 'go_goma.png' },

        { hira: 'ざ', kata: 'ザ', word: 'ざっし', image: 'za_zasshi.png' },
        { hira: 'じ', kata: 'ジ', word: 'じめん', image: 'ji_jimen.png' },
        { hira: 'ず', kata: 'ズ', word: 'ずかん', image: 'zu_zukan.png' },
        { hira: 'ぜ', kata: 'ゼ', word: 'ぜんまい', image: 'ze_zenmai.png' },
        { hira: 'ぞ', kata: 'ゾ', word: 'ぞう', image: 'zo_zou.png' },

        { hira: 'だ', kata: 'ダ', word: 'だんご', image: 'da_dango.png' },
        { hira: 'ぢ', kata: 'ヂ', word: 'ちぢみ', image: 'di_chijimi.png' },
        { hira: 'づ', kata: 'ヅ', word: 'つづみ', image: 'du_tsuzumi.png' },
        { hira: 'で', kata: 'デ', word: 'でんわ', image: 'de_denwa.png' },
        { hira: 'ど', kata: 'ド', word: 'どあ', image: 'do_doa.png' },
        
        { hira: 'ば', kata: 'バ', word: 'ばら', image: 'ba_bara.png' },
        { hira: 'び', kata: 'ビ', word: 'びーだま', image: 'bi_biidama.png' },
        { hira: 'ぶ', kata: 'ブ', word: 'ぶた', image: 'bu_buta.png' },
        { hira: 'べ', kata: 'ベ', word: 'べんち', image: 'be_benchi.png' },
        { hira: 'ぼ', kata: 'ボ', word: 'ぼうし', image: 'bo_boushi.png' },
        
        // --- 半濁音 ---
        { hira: 'ぱ', kata: 'パ', word: 'ぱん', image: 'pa_pan.png' },
        { hira: 'ぴ', kata: 'ピ', word: 'ぴあの', image: 'pi_piano.png' },
        { hira: 'ぷ', kata: 'プ', word: 'ぷりん', image: 'pu_purin.png' },
        { hira: 'ぺ', kata: 'ペ', word: 'ぺん', image: 'pe_pen.png' },
        { hira: 'ぽ', kata: 'ポ', word: 'ぽすと', image: 'po_posuto.png' },
        
        // --- 拗音（データ量が多いので代表的なもののみ）---
        { hira: 'きゃ', kata: 'キャ', word: 'きゃく', image: 'kya_kyaku.png' },
        { hira: 'しゃ', kata: 'シャ', word: 'しゃしん', image: 'sha_shashin.png' },
        { hira: 'ちゃ', kata: 'チャ', word: 'ちゃいろ', image: 'cha_chairo.png' },
        { hira: 'にゃ', kata: 'ニャ', word: 'にゃんこ', image: 'nya_nyanko.png' },
        { hira: 'ひゃ', kata: 'ヒャ', word: 'ひゃく', image: 'hya_hyaku.png' }
    ];

    const tbody = document.getElementById('kiso-tbody'); 
    
    if (tbody) {
        let html = '';
        KISO_DATA.forEach(item => {
            const imagePath = item.image ? `assets/images/${item.image}` : null;
            const wordDisplay = item.word && item.image ? `<br>(${item.word})` : '';

            html += `
                <tr>
                    <td class="char-hira">${item.hira}</td>
                    <td class="char-kata">${item.kata}</td>
                    <td class="char-illust">
                        ${imagePath ? `<img src="${imagePath}" alt="${item.word}" onerror="this.style.display='none'" class="kiso-illust">${wordDisplay}` : 'ー'}
                    </td>
                </tr>
            `;
        });
        tbody.innerHTML = html;
    }
});