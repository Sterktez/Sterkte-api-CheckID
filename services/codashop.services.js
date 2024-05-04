const crypto = require('crypto');
const fetch = require('node-fetch');
const formatedDate = require('../utils/formatedDate.js');

const codashopServices = async (game, id, zone) => {
   let dataBody;
   switch (game.slug) {
      case 'hago':
         dataBody = `voucherPricePoint.id=16107&voucherPricePoint.price=30294.0&voucherPricePoint.variablePrice=0&n=2%2F21%2F2023-2027&email=okebagsu426%40gmail.com&userVariablePrice=0&order.data.profile=eyJuYW1lIjoiICIsImRhdGVvZmJpcnRoIjoiIiwiaWRfbm8iOiIifQ%3D%3D&user.userId=${id}&user.zoneId=&msisdn=&voucherTypeName=HAGO&voucherTypeId=33&gvtId=43&shopLang=id_ID&checkoutId=bea3ecd6-4cdc-4b91-be56-a28fc0b4ffb6&affiliateTrackingId=&impactClickId=3NhRLCwl%3AxyNRNtT6ryOjXyTUkAyLjRfFSnCU80&anonymousId=7eb09d46-b08e-46c1-bc83-c127489d4d6c&fullUrl=https%3A%2F%2Fwww.codashop.com%2Fid-id%2Fhago&userSessionId=b2tlYmFnc3U0MjZAZ21haWwuY29t&userEmailConsent=false&userMobileConsent=false&verifiedMsisdn=&promoId=&promoCode=&clevertapId=49bec2319150449bb397c95acb9aaa02`;
         break;
      case 'lords-mobile':
         dataBody = `voucherPricePoint.id=49967&voucherPricePoint.price=5000.0&voucherPricePoint.variablePrice=0&n=7%2F14%2F2023-206&email=okebagus%40gmail.com&userVariablePrice=0&order.data.profile=eyJuYW1lIjoiICIsImRhdGVvZmJpcnRoIjoiIiwiaWRfbm8iOiIifQ%3D%3D&user.userId=${id}&user.zoneId=1051&msisdn=&voucherTypeName=LORDS_MOBILE&voucherTypeId=76&gvtId=93&shopLang=id_ID&checkoutId=7beb916e-70ad-45ec-ba54-7dabcbf49816&affiliateTrackingId=&impactClickId=&anonymousId=c36f04c2-606b-4420-8224-3558c2f0ef4b&fullUrl=https%3A%2F%2Fwww.codashop.com%2Fid-id%2Flords-mobile&userSessionId=b2tlYmFndXNAZ21haWwuY29t&userEmailConsent=false&userMobileConsent=false&verifiedMsisdn=&promoId=&promoCode=&clevertapId=2b03801e6ebd45cdb2d0c1a033ba47cc&promotionReferralCode=`;
         break;
      default:
         dataBody = `voucherPricePoint.id=${game.priceId}&voucherPricePoint.price=${
            game.price
         }&voucherPricePoint.variablePrice=0&n=${formatedDate()}-206&email=okebagsu426@gmail.com&userVariablePrice=0&order.data.profile=eyJuYW1lIjoiICIsImRhdGVvZmJpcnRoIjoiIiwiaWRfbm8iOiIifQ%3D%3D&user.userId=${id}&user.zoneId=${
            zone || ''
         }&msisdn=081123123123&voucherTypeName=${game.voucherTypeName}&voucherTypeId=${game.voucherTypeId}&gvtId=${
            game.gvtId
         }&shopLang=id_ID&checkoutId=${crypto.randomUUID()}&affiliateTrackingId=&impactClickId=3NhRLCwl:xyNRNtT6ryOjXyTUkAyLjRfFSnCU80&anonymousId=${crypto.randomUUID()}&fullUrl=${
            'https://www.codashop.com/id-id/' + game.slug
         }&userSessionId=${crypto.randomUUID()}&userEmailConsent=false&userMobileConsent=false&verifiedMsisdn=&promoId=&promoCode=&clevertapId=49bec2319150449bb397c95acb9aaa02`;
         break;
   }

   const getUsernameGame = await fetch('https://order-sg.codashop.com/initPayment.action', {
      method: 'POST',
      headers: {
         'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
         'user-agent':
            'Mozilla/5.0 Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
         'x-session-country2name': 'ID',
         'x-session-key': '',
         'x-xsrf-token': null,
      },
      body: dataBody,
   });

   try {
      const getUsernameGameResponse = await getUsernameGame.json();
      // console.log('getUsernameGameResponse', getUsernameGameResponse?.confirmationFields?.roles);
      if (getUsernameGameResponse.RESULT_CODE && getUsernameGameResponse.RESULT_CODE == 10001)
         return { code: 400, status: false, message: 'Silahkan Coba 5 detik lagi' };
      if (getUsernameGameResponse.success) {
         if (getUsernameGameResponse.result == '') return { code: 404, status: false, message: 'ID tidak ditemukan' };
         const result = decodeURIComponent(getUsernameGameResponse.result) || {};
         const newResult = JSON.parse(result) || {};

         return {
            code: 200,
            status: true,
            message: 'ID berhasil ditemukan',
            data: {
               username:
                  newResult?.username ||
                  getUsernameGameResponse?.confirmationFields?.playerName ||
                  getUsernameGameResponse?.confirmationFields?.roles[0]?.role ||
                  null,
               user_id: id,
               zone: zone || null,
            },
         };
      }

      return { code: 200, status: false, message: getUsernameGameResponse.errorMsg || 'Hubungi Admin' };
   } catch (err) {
      console.log(err);
      return { code: 500, status: false, message: 'Internal Server Error' };
   }
};

module.exports = codashopServices;
