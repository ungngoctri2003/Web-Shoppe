using Microsoft.AspNetCore.Components.Forms;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Security.Cryptography;
using System.Text;

namespace ProductAPI.Helpers
{
    public class VnPayLibrary
    {
        private readonly SortedList<string, string> _requestData = new SortedList<string, string>();
        private readonly SortedList<string, string> _responseData = new SortedList<string, string>();

        public void AddRequestData(string key, string value)
        {
            if (!string.IsNullOrEmpty(value))
            {
                _requestData[key] = value;
            }
        }

        public void AddResponseData(string key, string value)
        {
            if (!string.IsNullOrEmpty(value))
            {
                _responseData[key] = value;
            }
        }

        /// <summary>
        /// Tạo URL thanh toán gửi sang VNPay
        /// </summary>
        public string CreateRequestUrl(string baseUrl, string vnp_HashSecret)
        {
            var query = new StringBuilder();
            foreach (KeyValuePair<string, string> kv in _requestData)
            {
                if (!string.IsNullOrEmpty(kv.Value))
                {
                    query.Append(Uri.EscapeDataString(kv.Key));
                    query.Append('=');
                    query.Append(Uri.EscapeDataString(kv.Value));
                    query.Append('&');
                }
            }

            var queryString = query.ToString().TrimEnd('&');
            var vnp_SecureHash = HashHmacSHA512(vnp_HashSecret, queryString);

            return $"{baseUrl}?{queryString}&vnp_SecureHash={vnp_SecureHash}";
        }
        public bool ValidateSignature(string inputHash, string secretKey)
        {
            string rspRaw = GetResponseData();
            string myChecksum = HashHmacSHA512(secretKey, rspRaw);
            return myChecksum.Equals(inputHash, StringComparison.InvariantCultureIgnoreCase);
        }
        private string GetResponseData()
        {

            StringBuilder data = new StringBuilder();
            if (_responseData.ContainsKey("vnp_SecureHashType"))
            {
                _responseData.Remove("vnp_SecureHashType");
            }
            if (_responseData.ContainsKey("vnp_SecureHash"))
            {
                _responseData.Remove("vnp_SecureHash");
            }
            foreach (KeyValuePair<string, string> kv in _responseData)
            {
                if (!String.IsNullOrEmpty(kv.Value))
                {
                    data.Append(WebUtility.UrlEncode(kv.Key) + "=" + WebUtility.UrlEncode(kv.Value) + "&");
                }
            }
            //remove last '&'
            if (data.Length > 0)
            {
                data.Remove(data.Length - 1, 1);
            }
            return data.ToString();
        }
        /// <summary>
        /// Lấy dữ liệu trả về từ VNPay và xác minh chữ ký
        /// </summary>
        public bool GetResponseData(IQueryCollection collection, string vnp_HashSecret)
        {
            foreach (var (key, value) in collection)
            {
                if (!string.IsNullOrEmpty(value) && key.StartsWith("vnp_"))
                {
                    AddResponseData(key, value);
                }
            }

            if (!_responseData.TryGetValue("vnp_SecureHash", out var secureHash))
                return false;

            _responseData.Remove("vnp_SecureHash");
            _responseData.Remove("vnp_SecureHashType");

            var signData = string.Join("&", _responseData
                .Select(kv => $"{Uri.EscapeDataString(kv.Key)}={Uri.EscapeDataString(kv.Value)}"));

            var myChecksum = HashHmacSHA512(vnp_HashSecret, signData);
            return myChecksum.Equals(secureHash, StringComparison.InvariantCultureIgnoreCase);
        }



        private static string HashHmacSHA512(string key, string input)
        {
            var hash = new StringBuilder();
            byte[] keyBytes = Encoding.UTF8.GetBytes(key);
            byte[] inputBytes = Encoding.UTF8.GetBytes(input);
            using (var hmac = new HMACSHA512(keyBytes))
            {
                byte[] hashValue = hmac.ComputeHash(inputBytes);
                foreach (var theByte in hashValue)
                {
                    hash.Append(theByte.ToString("x2"));
                }
            }

            return hash.ToString();
        }
    }
}