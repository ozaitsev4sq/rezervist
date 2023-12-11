using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RezervistUmbraco.Data.Models
{
    public class Order
    {
        public string Id { get; set; }

        public string GoodsItemId { get; set; }

        public string UserId { get; set; }

        public string Cost { get; set; }

        public DateTime Date { get; set; }

        public Order()
        {
            Id = Guid.NewGuid().ToString();
        }
    }
}