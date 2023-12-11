using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RezervistUmbraco.Data.Models
{
    public class ProductImmagesStorage
    {
        public string Id { get; set; }

        public string ProductId { get; set; }

        public List<ProductImage> Immages { get; set; }

        public DateTime UploadingDateTime { get; set; } = DateTime.Now;

        public ProductImmagesStorage()
        {
            this.Id = Guid.NewGuid().ToString();
            this.Immages = new List<ProductImage>();
        }

        public ProductImmagesStorage(string productId) : this()
        {
            this.ProductId = productId;
        }
    }
}